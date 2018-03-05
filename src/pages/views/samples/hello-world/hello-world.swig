{% extends '../../../layouts/index.swig' %}
{% block body %}

<css src='./hello-world.pcss'></css>

<js src="jquery" chunk="vendor" cache="true"></js> 
<js src='./hello-world.js'></js>

<div>
  <div id='counter'></div>
</div>
{% endblock %}
