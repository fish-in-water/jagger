
{% extends '../../../layouts/index.swig' %}
{% block body %}


  
<css src="../../../../components/reset.pcss" chunk="vendor" cache="true"></css>
<css src="../../../../vendors/frozenui/dist/css/frozen.css" chunk="vendor" cache="true" compile="false"></css> 
<css src="./app.pcss"></css> 

<js src="../../../../vendors/zepto/zepto.js" chunk="vendor" cache="true" compile="false"></js> 
<js src="../../../../components/tap.js" chunk="vendor" cache="true"></js>
<js src="vue" chunk="vendor" cache="true"></js> 
<js src="vue-router" chunk="vendor" cache="true"></js> 
<js src="vue-navigation" chunk="vendor" cache="true"></js> 
<js src="vuex" chunk="vendor" cache="true"></js> 
<js src="axios" chunk="vendor" cache="true"></js> 
<js src="base-64" chunk="vendor" cache="true"></js>
<js src="./app.js"></js>  

{% if __SSR__ %}
  {% autoescape %}{{ __HTML__ }}{% endautoescape %}
  <script type="text/javascript">
    window.__STATE__ = {% autoescape %}{{ __STATE__ }}{% endautoescape %};
  </script>
{% else %}
  <div id="app">
  </div>
{% endif %}

{% endblock %}
 