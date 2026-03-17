from django.urls import path
from applications.views import SubmitApplicationView, ListApplicationView, ApproveApplicationView, DeclineApplicationView

urlpatterns = [
    path('apply/', SubmitApplicationView.as_view(), name='apply'),
    path('list/', ListApplicationView.as_view(), name='list_applications'),
    path('<int:pk>/approve/', ApproveApplicationView.as_view(), name='approve'),
    path('<int:pk>/decline/', DeclineApplicationView.as_view(), name='decline'),
]
