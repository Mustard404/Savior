from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from server.api import views
from django.conf.urls import url

router = routers.DefaultRouter()
router.register(r'project', views.ProjectViewSet)
router.register(r'program', views.ProgramViewSet)
router.register(r'report', views.ReportViewSet)
router.register(r'vul', views.VulViewSet)
#router.register(r'vul_download', views.vul_downloads)


urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/', include(router.urls)),
    #path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    #path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    #path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/login/', views.LoginView.as_view(), name='token_refresh'),
    path('api/userinfo/', views.Userinfo_view),
    path('api/currentuser/', views.currentUser_view),
    path('api/vul_download/', views.vul_download),
]

