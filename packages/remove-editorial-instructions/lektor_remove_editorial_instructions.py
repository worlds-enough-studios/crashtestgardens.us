# -*- coding: utf-8 -*-
import logging
from functools import wraps
import re

from lektor.pluginsystem import Plugin
from six import text_type

from markupsafe import soft_unicode
from typogrify.filters import amp, caps, initial_quotes, smartypants, titlecase, typogrify, widont, TypogrifyError
import jinja2
from jinja2.exceptions import TemplateError


def accept_soft_unicode(func):
    @wraps(func)
    @jinja2.evalcontextfilter
    def wrapper(eval_ctx, value):
        if hasattr(value, '__html__'):
            value = text_type(soft_unicode(value.__html__()))
        else:
            value = soft_unicode(value)
        try:
            out = func(value)
            return jinja2.Markup(out)
        except TypogrifyError as e:
            raise TemplateError(e.message)

    wrapper.is_safe = True
    return wrapper


editorial_p = r'''\[\[[^\]]+\]\]'''

ed_w_surrounding_space_p = re.compile(r''' +%s +''' % editorial_p)

ed_w_leading_space_cp = re.compile(r''' +%s''' % editorial_p)

ed_w_trailing_space_cp = re.compile(r'''%s +''' % editorial_p)

ed_no_space_cp = re.compile(editorial_p)


def remove_editorial_instructions(text):
    old_text = text
    text = ed_w_surrounding_space_p.sub(' ', text)
    text = ed_w_trailing_space_cp.sub('', text)
    text = ed_w_leading_space_cp.sub('', text)
    text = ed_no_space_cp.sub('', text)
    text = text.replace('<p></p>', '')
    return text


class RemoveEditorialInstructionsPlugin(Plugin):
    name = u'Remove Editorial Instructions'
    description = u'Add your description here.'

    def on_setup_env(self, **extra):
        env = self.env.jinja_env
        env.filters['deeditorialize'] = accept_soft_unicode(remove_editorial_instructions)
