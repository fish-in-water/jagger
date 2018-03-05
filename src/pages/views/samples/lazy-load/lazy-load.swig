{% extends '../../../layouts/index.swig' %}
{% block body %}

<css src='./lazy-load.pcss'></css>
<js src="jquery" chunk="vendor" cache="true"></js> 
<js src='./lazy-load.js'></js>

<div>
  <button id='load'>Load</button>
</div>
{% endblock %}
