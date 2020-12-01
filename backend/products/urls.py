from django.urls import path, include
from .views import (ProductListView, ProductView,
                    AddToCartView, OrderSummaryView, OrderItemDeleteView, UpdateQunatityView, PaymentView, CountryListView,PaymentListView)

urlpatterns = [
    path('', ProductListView.as_view()),
    path('<pk>', ProductView.as_view()),
    path('add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('OrderSummary/<user_id>', OrderSummaryView.as_view(), name='OrderSummary'),
    path('order-items/<pk>/delete/',
         OrderItemDeleteView.as_view(), name='order-item-delete'),
    path('update_quantity/', UpdateQunatityView.as_view(), name='update_quantity'),
    path('checkout/', PaymentView.as_view(), name='checkout'),
    path('country_list/', CountryListView.as_view(), name='country_list'),
    path('payment_history/', PaymentListView.as_view(),name='payment_history')
]

# ---------En Cas Viewset-------------
# from .views import ProductViewSet
# from rest_framework.routers import DefaultRouter

# router = DefaultRouter()
# router.register('', ProductViewSet, basename='product')
# urlpatterns = router.urls
