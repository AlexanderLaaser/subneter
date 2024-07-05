import json
from django.contrib.auth import authenticate, login, get_user_model, logout
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt

CustomUser = get_user_model()

@api_view(['POST'])
def register_user(request):
    try:
        data = json.loads(request.body)
        password = data['password']
        email = data['email']
        first_name = data.get('firstname', '')
        last_name = data.get('lastname', '')
    except (KeyError, json.JSONDecodeError) as e:
        return JsonResponse({'error': 'Invalid or missing data'}, status=400)

    if not (password and email):
        return JsonResponse({'error': 'Missing data'}, status=400)

    try:
        user = CustomUser.objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name)
        user.save()
        return JsonResponse({'message': 'User registered successfully'}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
def login_user(request):
    try:
        data = json.loads(request.body)
        email = data['email']
        password = data['password']
    except (KeyError, json.JSONDecodeError) as e:
        return JsonResponse({'error': 'Invalid or missing data'}, status=400)

    if not (email and password):
        return JsonResponse({'error': 'Missing email or password'}, status=400)

    user = authenticate(request, email=email, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            return JsonResponse({'message': 'Login successful'}, status=200)
        else:
            return JsonResponse({'error': 'Account is disabled'}, status=403)
    else:
        return JsonResponse({'error': 'Invalid login credentials'}, status=401)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user = request.user
    user_data = {
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name
    }
    return JsonResponse({'user': user_data}, status=200)

@api_view(['POST'])
def logout_user(request):
    logout(request)
    return JsonResponse({'message': 'Logged out successfully'}, status=200)

@api_view(['POST'])

def check_email(request):
    try:
        data = json.loads(request.body)
        email = data['email']
    except (KeyError, json.JSONDecodeError) as e:
        return JsonResponse({'error': 'Invalid or missing data'}, status=400)

    if CustomUser.objects.filter(email=email).exists():
        return JsonResponse({'available': False}, status=200)
    return JsonResponse({'available': True}, status=200)