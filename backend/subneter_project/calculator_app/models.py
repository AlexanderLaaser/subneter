from django.db import models
from subneter_project import settings

class Vnet(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class AddressSpace(models.Model):
    vnet = models.ForeignKey(Vnet, on_delete=models.CASCADE, related_name='addressspaces')
    networkaddress = models.CharField(max_length=255)
    subnetmask = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.networkaddress

class Subnet(models.Model):
    vnet = models.ForeignKey(Vnet, on_delete=models.CASCADE, related_name='subnets')
    name = models.CharField(max_length=255)
    subnetmask = models.IntegerField()
    ips = models.IntegerField()
    range = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
