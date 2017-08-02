define(["underscore","config","services/suluarticle/list-helper"],function(a,b,c){"use strict";var d={options:{locale:null,url:"",resultKey:null,searchFields:[],instanceName:"teaser-selection",selectCallback:function(a){}},templates:{skeleton:['<div class="teaser-selection-tabs"></div>','<div class="grid">','   <div class="grid-row search-row">','       <div class="grid-col-12 teaser-selection-search"/>',"   </div>",'   <div class="grid-row">','       <div class="grid-col-12 teaser-selection-list"/>',"   </div>","</div>"].join("")},translations:{filterAll:"sulu_article.list.filter.all",filterByTimescale:"sulu_article.list.filter.by-timescale",published:"public.published",unpublished:"public.unpublished"}},e=b.get("sulu_article"),f=function(){if(1===e.typeNames.length)return[];var b=[];return e.displayTabAll===!0&&b.push({id:"all",name:"public.all"}),a.each(e.typeNames,function(a){b.push({id:a,name:e.types[a].title})}.bind(this)),b};return{defaults:d,initialize:function(){this.$el.parent().removeClass("content-spacing"),this.$el.parent().addClass("article-teaser-selection");var b=$(this.templates.skeleton());this.$el.append(b);var d=this.retrieveListToolbarTemplate();this.sandbox.sulu.initListToolbarAndList.call(this,"article","/admin/api/articles/fields",{el:".teaser-selection-search",instanceName:this.options.instanceName,template:d},{el:".teaser-selection-list",instanceName:this.options.instanceName,url:this.getUrl(),preselected:a.map(this.options.data,function(a){return a.id}),resultKey:this.options.resultKey,clickCallback:function(a){this.sandbox.emit("husky.datagrid.teaser-selection.toggle.item",a)}.bind(this),searchInstanceName:this.options.instanceName,searchFields:this.options.searchFields,paginationOptions:{dropdown:{limit:20}},viewOptions:{table:{actionIconColumn:"title",badges:[{column:"title",callback:function(a,b){return c.generateLocalizationBadge(a,b,this.options.locale)}.bind(this)},{column:"title",callback:c.generateWorkflowBadge}]}}}),this.sandbox.start([{name:"tabs@husky",options:{el:".teaser-selection-tabs",data:f(),callback:this.changeType.bind(this)}},{name:"articles/list/authored-selection/form@suluarticle",options:{el:".slide.authored-slide .overlay-content",data:this.options.data,selectCallback:this.closeAuthoredSelection.bind(this)}}]),this.bindCustomEvents()},bindCustomEvents:function(){this.sandbox.on("husky.datagrid."+this.options.instanceName+".item.select",function(a){this.options.selectCallback({type:this.options.type,id:a})}.bind(this)),this.sandbox.on("husky.datagrid."+this.options.instanceName+".item.deselect",function(a){this.options.deselectCallback({type:this.options.type,id:a})}.bind(this))},getUrl:function(){return this.options.url.replace("{locale}",this.options.locale)},changeType:function(a){var b=a.id;"all"===a.id&&(b=null),this.sandbox.emit("husky.datagrid."+this.options.instanceName+".url.update",{type:b})},retrieveListToolbarTemplate:function(){return this.sandbox.sulu.buttons.get({authoredDate:{options:{icon:"calendar",group:2,title:this.translations.filterAll,showTitle:!0,dropdownOptions:{idAttribute:"id",markSelected:!1},dropdownItems:[{title:this.translations.filterAll,callback:this.closeAuthoredSelection.bind(this)},{id:"timescale",title:this.translations.filterByTimescale,callback:this.openAuthoredSelection.bind(this)}]}},workflowStage:{options:{icon:"circle-o",group:2,title:c.getPublishedTitle(),showTitle:!0,dropdownOptions:{idAttribute:"id",markSelected:!0,changeButton:!0},dropdownItems:[{title:this.translations.filterAll,marked:!0,callback:function(){this.setWorkflowStage(null)}.bind(this)},{id:"published",title:this.translations.published,callback:function(){this.setWorkflowStage("published")}.bind(this)},{id:"test",title:this.translations.unpublished,callback:function(){this.setWorkflowStage("test")}.bind(this)}]}}})},openAuthoredSelection:function(){this.$el.parent().addClass("limited"),this.sandbox.emit("husky.overlay."+this.options.instanceName+".slide-to",1),this.sandbox.once("sulu_content.teaser-selection."+this.options.instanceName+".ok-button.clicked",function(){this.sandbox.emit("sulu_article.authored-selection.form.get")}.bind(this))},closeAuthoredSelection:function(a){this.$el.parent().removeClass("limited"),this.sandbox.emit("husky.datagrid."+this.options.instanceName+".url.update",{authoredFrom:a?a.from:null,authoredTo:a?a.to:null}),this.sandbox.emit("husky.toolbar."+this.options.instanceName+".button.set","authoredDate",{title:c.getAuthoredTitle(a)}),this.sandbox.emit("husky.overlay."+this.options.instanceName+".slide-to",0)},setWorkflowStage:function(a){this.sandbox.emit("husky.datagrid."+this.options.instanceName+".url.update",{workflowStage:a})}}});