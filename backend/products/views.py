from django.shortcuts import render, get_object_or_404
from rest_framework.generics import ListAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Product, OrderItem, Order, Payment, Address
from .serializers import ProductSerializer, OrderItemSerializer, OrderSerializer, PaymentSerializer
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from django.http import Http404
from django.utils import timezone
from accounts.models import UserAccount
from django.core.exceptions import ObjectDoesNotExist
import stripe
from django.conf import settings
from django_countries import countries


stripe.api_key = settings.STRIPE_SECRET_KEY


class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = None


class AddToCartView(APIView):
    pagination_class = None
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        user_id = request.data.get('user_id', None)
        if slug is None:
            return Response({"message": "Invalid request"}, status=HTTP_400_BAD_REQUEST)
        item = get_object_or_404(Product, slug=slug)
        user = get_object_or_404(UserAccount, id=user_id)

        order_item_qs = OrderItem.objects.filter(
            item=item,
            user=user,
            ordered=False
        )

        if order_item_qs.exists():
            order_item = order_item_qs.first()
            order_item.quantity += 1
            order_item.save()
        else:
            order_item = OrderItem.objects.create(
                item=item,
                user=user,
                ordered=False
            )
            order_item.save()

        order_qs = Order.objects.filter(user=user, ordered=False)
        if order_qs.exists():
            order = order_qs[0]
            if not order.items.filter(item__id=order_item.id).exists():
                order.items.add(order_item)
                return Response(status=HTTP_200_OK)

        else:
            ordered_date = timezone.now()
            order = Order.objects.create(
                user=user, ordered_date=ordered_date)
            order.items.add(order_item)
            return Response(status=HTTP_200_OK)


class OrderSummaryView(APIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        try:
            user_id = self.kwargs['user_id']
            user = get_object_or_404(UserAccount, id=user_id)
            order = Order.objects.get(user=user, ordered=False)
            return Response(OrderSerializer(order).data)
        except ObjectDoesNotExist:
            raise Http404("You do not have an active order")
            # return Response({"message": "You do not have an active order"}, status=HTTP_400_BAD_REQUEST)


class UpdateQunatityView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        user_id = request.data.get('user_id', None)
        if slug is None:
            return Response({"message": "Invalid request"}, status=HTTP_400_BAD_REQUEST)
        item = get_object_or_404(Product, slug=slug)
        user = get_object_or_404(UserAccount, id=user_id)

        order_item_qs = OrderItem.objects.filter(
            item=item,
            user=user,
            ordered=False
        )

        if order_item_qs.exists():
            order_item = order_item_qs.first()
            if order_item.quantity > 1:
                order_item.quantity -= 1
                order_item.save()
                return Response({"message": "Quantity Updated"}, status=HTTP_200_OK)
            else:
                order_item.quantity = 1
                order_item.save()
                return Response({"message": "Less Quantity Is One Item "}, status=HTTP_200_OK)
        else:
            return Response({"message": "This item was not in your cart"}, status=HTTP_400_BAD_REQUEST)


class OrderItemDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderItemSerializer
    queryset = OrderItem.objects.all()


class PaymentView(APIView):

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id', None)
        user = get_object_or_404(UserAccount, id=user_id)
        order = Order.objects.get(user=user, ordered=False)
        payment_method_id = request.data.get('payment_method_id', None)
        # Address Info

        zip = request.data.get('zip', None)
        street_address = request.data.get('street_address', None)
        apartment_address = request.data.get('apartement_address', None)
        country = request.data.get('country', None)
        extra_msg = ''  # add new variable to response message

        # create Address
        # check if th user have an address
        address_qs = Address.objects.filter(user=user)
        if address_qs.exists():
            address = address_qs.first()
            address.street_address = street_address
            address.apartment_address = apartment_address
            address.country = country
            address.zip = zip
            address.save()
        else:
            address = Address()
            address.user = user
            address.street_address = street_address
            address.apartment_address = apartment_address
            address.country = country
            address.zip = zip
            address.save()

        amount = int(order.get_total() * 100)

        try:
            # checking if customer with provided email already exists
            customer_data = stripe.Customer.list(email=user.email).data

            # if the array is empty it means the email has not been used yet
            if len(customer_data) == 0:
                # creating customer
                customer = stripe.Customer.create(
                    email=user.email, payment_method=payment_method_id)
            else:
                customer = customer_data[0]
                extra_msg = "Customer already existed."

            stripe.PaymentIntent.create(customer=customer,
                                        payment_method=payment_method_id,
                                        currency='usd',
                                        amount=amount,
                                        confirm=True)

            # create the payment
            payment = Payment()
            payment.stripe_id = payment_method_id
            payment.user = user
            payment.amount = order.get_total()
            payment.save()

            # assign the payment to the order

            order_items = order.items.all()
            order_items.update(ordered=True)
            for item in order_items:
                item.save()

            order.ordered = True
            order.payment = payment
            order.shipping_address = address
            order.save()

            return Response({'message': 'Success', 'data': {
                'customer_id': customer.id, 'extra_msg': extra_msg}
            }, status=HTTP_200_OK)

        except stripe.error.CardError as e:
            body = e.json_body
            err = body.get('error', {})
            return Response({"message": f"{err.get('message')}"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.RateLimitError as e:
            # Too many requests made to the API too quickly
            messages.warning(self.request, "Rate limit error")
            return Response({"message": "Rate limit error"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.InvalidRequestError as e:
            print(e)
            # Invalid parameters were supplied to Stripe's API
            return Response({"message": "Invalid parameters"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.AuthenticationError as e:
            # Authentication with Stripe's API failed
            # (maybe you changed API keys recently)
            return Response({"message": "Not authenticated"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.APIConnectionError as e:
            # Network communication with Stripe failed
            return Response({"message": "Network error"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.StripeError as e:
            # Display a very generic error to the user, and maybe send
            # yourself an email
            return Response({"message": "Something went wrong. You were not charged. Please try again."}, status=HTTP_400_BAD_REQUEST)

        except Exception as e:
            # send an email to ourselves
            return Response({"message": "A serious error occurred. We have been notifed."}, status=HTTP_400_BAD_REQUEST)

        return Response({"message": "Invalid data received"}, status=HTTP_400_BAD_REQUEST)


class PaymentListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class CountryListView(APIView):
    def get(self, request, *args, **kwargs):
        return Response(countries, status=HTTP_200_OK)
