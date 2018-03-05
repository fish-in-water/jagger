{% extends '../../../layouts/index.swig' %}
{% block body %}

<css src='./reference.pcss'></css>
<js src="jquery" chunk="vendor" cache="true"></js> 
<js src='./reference.js'></js>

<div>
  <div>
    <p>Images In HTML</p>
    <img src='./logo.jpg' width='100px' height='100px'></img>
  </div>
  <hr>
  <div>
    <p>Images In Separate CSS</p>
    <div class='logo'></div>
  </div>
  <hr>
  <div>
    <p>Images In In-line CSS</p>
    <div style='width:100px;height:100px;background:url(./logo.jpg);background-size: cover;'></div>
  </div>
  <hr>
  <div>
    <p>Images In JS</p>
    <div id='logo'></div>
  </div>
</div>
{% endblock %}
