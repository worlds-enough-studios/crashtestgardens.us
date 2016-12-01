# -*- coding: utf-8 -*-
import logging
from functools import wraps
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


class TypogrifyPlugin(Plugin):
    name = u'Typogrify'
    description = u'Adds filters to enhance web typography.'

    def on_setup_env(self, **extra):
        env = self.env.jinja_env
        env.filters['amp'] = accept_soft_unicode(amp)
        env.filters['caps'] = accept_soft_unicode(caps)
        env.filters['initial_quotes'] = accept_soft_unicode(initial_quotes)
        env.filters['smartypants'] = accept_soft_unicode(smartypants)
        env.filters['titlecase'] = accept_soft_unicode(titlecase)
        env.filters['typogrify'] = accept_soft_unicode(typogrify)
        env.filters['widont'] = accept_soft_unicode(widont)
