{% extends '../../../layouts/index.swig' %}
{% block body %}

<css src='./mirage.pcss'></css>
<js src="../../../../vendors/zepto/zepto.js" chunk="vendor" cache="true" compile="false"></js> 
<js src="../../../components/cache.js" chunk="vendor" cache="true"></js>
<js src='./mirage.js'></js>

<div>
  <button id='btn'>go App</button>
</div>

{% if __CACHES__ %}
<script type="text/javascript">
  window.__CACHES__ = {% autoescape %}{{ __CACHES__ }}{% endautoescape %};
</script>
{% endif %}

{% endblock %}
