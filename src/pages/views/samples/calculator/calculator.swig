{% extends '../../../layouts/index.swig' %}
{% block body %}

<css src='./calculator.pcss'></css>
<js src="jquery" chunk="vendor" cache="true"></js> 
<js src='./calculator.js'></js>

<div>
  <input id='num0' type='number' />
  +
  <input id='num1' type='number' />
  =
  <input id='sum' type='text' />
</div>
{% endblock %}
