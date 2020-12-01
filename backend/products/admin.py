from django.contrib import admin
from .models import Product, OrderItem, Order, Address


class AddressAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'street_address', 'apartment_address')
    list_display_links = ('id', 'user')
    list_per_page = 10


class ProductsAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'price')
    list_display_links = ('id', 'title')
    search_fields = ('category', 'title', )
    list_per_page = 25


class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'item', 'quantity')
    list_display_links = ('id', 'item')
    search_fields = ('category', 'title', )
    list_per_page = 25


class OrderAdmin(admin.ModelAdmin):
    list_display = ['user',
                    'ordered',
                    'being_delivered',
                    'received',
                    'refund_requested',
                    'refund_granted',
                    'shipping_address',
                    'payment', ]
    list_display_links = [
        'user',
        'shipping_address',
        'payment',
    ]
    list_filter = ['ordered',
                   'being_delivered',
                   'received',
                   'refund_requested',
                   'refund_granted']
    search_fields = [
        'user__username',
        'ref_code'
    ]


admin.site.register(Product, ProductsAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Address, AddressAdmin)
