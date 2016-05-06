from django import forms
from talk.models import Post


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        # exclude = ['author', 'updated', 'created', ]
        fields = ['text']
        widgets = {
            'text': forms.Textarea(
                attrs={'id': 'post-text', 'required': True, 'placeholder': "Say something...", 'rows': '5'}
            )
        }
