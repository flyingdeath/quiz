function listSortClass(options){
    try{
      this.elements = {};
      this.h = new helperClass();
      this.initializeOptions(options);
      this.initializeCustomProxy();
      //this.d = new debugClass({createNode:1});
//this.a = new debugClass({createNode:1});
//this.b = new debugClass({createNode:1,nodeId:"test"});
//this.c = new debugClass({createNode:1,nodeId:"test1"});
      
      this.defaults = {}
  this.initialize(this.containerId,"normaldd");  
    }catch(err){
      debugger;
    }
  }
  
  listSortClass.prototype.constructor = listSortClass;

  /*------------------------------------------------------------------------------------------------*/

  listSortClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }
  
  listSortClass.prototype.initialize = function(contianerId, group){
    var contianer = document.getElementById(contianerId);
    var scrollContainer = this.h.getPrefix(contianerId);
    this.initializing = true;
    if(contianer){
      var list = YAHOO.util.Dom.getElementsByClassName(this.itemClassName,'',contianer);
      for(var i = 0;i<list.length;i++){
          this.initializeDragable(list[i].id, this.elements[list[i].id], group, scrollContainer);
      }
      this.initializeDropable(contianerId, group);
    }
    this.initializing = false;
    this.h.deleteDomElement(contianer);
    contianer = null;
    this.h.deleteDomArray(list);
    list = null;
  }
  
  listSortClass.prototype.initializeDropable = function(id, group){
    new YAHOO.util.DDTarget(id, group);
  }
  
  
  listSortClass.prototype.initializeDragable = function(id, element, group, contianerId){
    element = new this.customDragable(id,group, {scroll:false}, contianerId );
  }

  listSortClass.prototype.customDragable = function(id, sGroup, config, contianerId) {

    var dragable = listSortClass.prototype.customDragable.superclass.constructor.call(this, id, sGroup, config);

    var el = this.getDragEl();
    
    this.goingUp = false;
    this.lastY = 0;
    this.contianerId = contianerId;
    
    // The proxy is slightly transparent
   // YAHOO.util.Dom.setStyle(el, "opacity", 0.67); 
    
    new helperClass().deleteDomElement(el);
    el = null;
    

    return dragable;
  };

  
  listSortClass.prototype.initializeCustomProxy = function(){
    var instanceObj = this;
    YAHOO.extend(this.customDragable, YAHOO.util.DDProxy, {
      startDrag: function(x, y) {
        instanceObj.startDrag_p(this,x,y);
      },
      endDrag: function(e) {
        instanceObj.endDrag_p(this,e);
      },
      onDragDrop: function(e, id) {
        instanceObj.onDragDrop_p(this, e, id);
      },
      onDrag: function(e) {
        instanceObj.onDrag_p(this, e);
      },
      onDragOver: function(e, id) {
        instanceObj.onDragOver_p(this, e, id);
      }
    });
  }
  

  listSortClass.prototype.startDrag_p = function(dragObj, x, y){

    // make the proxy look like the source element
    var dragEl = dragObj.getDragEl();
    var clickEl = dragObj.getEl();
    YAHOO.util.Dom.setStyle(clickEl, "visibility", "hidden");

    dragEl.innerHTML = clickEl.innerHTML;
    //var color = YAHOO.util.Dom.getStyle(clickEl, "color");
    //var bgcolor = YAHOO.util.Dom.getStyle(clickEl, "backgroundColor");
    //YAHOO.util.Dom.setStyle(dragEl, "color",color);
    //YAHOO.util.Dom.setStyle(dragEl, "backgroundColor", bgcolor);
    YAHOO.util.Dom.setStyle(dragEl, "border", "none");
    this.startedDragPosition = this.h.getCurrentListPosition(clickEl.id);
    this.h.deleteDomElement(dragEl);
    dragEl = null;
    this.h.deleteDomElement(clickEl);
    clickEl = null;
  }
  
  
  listSortClass.prototype.endDrag_p = function(dragObj, e){
  
    var srcEl = dragObj.getEl();
    var proxy = dragObj.getDragEl();
   // var itemPrefix = srcEl.id.replace(this.titleItemSurfix,'');
    var curPosition = this.h.getCurrentListPosition(srcEl.id);
    this.h.setIndexeByClassName(srcEl.id, curPosition, 'itemIndex');
    //this.cue.moveTitle(itemPrefix, curPosition, this.startedDragPosition);
    this.started_drag_position  = null;
    // Show the proxy element and animate it to the src element's location
    YAHOO.util.Dom.setStyle(proxy, "visibility", "");
    var a = new YAHOO.util.Motion( 
      proxy, { 
        points: { 
          to:YAHOO.util.Dom.getXY(srcEl)
        }
      }, 
      0.2, 
      YAHOO.util.Easing.easeOut 
    );
    var proxyid = proxy.id;
    var thisid = dragObj.id;
  
    // Hide the proxy and show the source element when finished with the animation
    a.onComplete.subscribe(function() {
           YAHOO.util.Dom.setStyle(proxyid, "visibility", "hidden");
           YAHOO.util.Dom.setStyle(thisid, "visibility", "");
    });
    a.animate();
    this.h.deleteDomElement(srcEl);
    srcEl = null;
    this.h.deleteDomElement(proxy);
    proxy = null;
    
  }
   
  
  listSortClass.prototype.onDragDrop_p = function(dragObj, e, id) {
    
    // If there is one drop interaction, the li was dropped either on the list,
    // or it was dropped on the current location of the source element.
    if(YAHOO.util.DragDropMgr.interactionInfo.drop.length === 1) {
    
      // The position of the cursor at the time of the drop (YAHOO.util.Point)
      var pt = YAHOO.util.DragDropMgr.interactionInfo.point; 
    
      // The region occupied by the source element at the time of the drop
      var region = YAHOO.util.DragDropMgr.interactionInfo.sourceRegion; 
    
      // Check to see if we are over the source element's location.  We will
      // append to the bottom of the list once we are sure it was a drop in
      // the negative space (the area of the list without any list items)
      if(region.intersect(pt)) {
        var destEl =YAHOO.util.Dom.get(id);
        var target =YAHOO.util.Event.getTarget(e); 
        var destDD = YAHOO.util.DragDropMgr.getDDById(id);
        var clickEl = dragObj.getEl();
       //  destEl.appendChild(clickEl);
      //  destEl.insertBefore(clickEl, clickEl);
        destDD.isEmpty = false;
        YAHOO.util.DragDropMgr.refreshCache();
        this.h.deleteDomElement(destEl);
    destEl = null;
      }
    
    }
  } 
  
  
  listSortClass.prototype.onDrag_p = function(dragObj, e) {
    // Keep track of the direction of the drag for use during onDragOver
    var y = YAHOO.util.Event.getPageY(e);
    if(y < dragObj.lastY){
      dragObj.goingUp = true;
    }else if(y > dragObj.lastY){
      dragObj.goingUp = false;
    }
    dragObj.lastY = y;
    
    var deltaScroll = dragObj.getEl().scrollHeight;
    
    var p = document.getElementById(dragObj.contianerId);
    var domPos = YAHOO.util.Dom.getXY(dragObj.contianerId);
    
    var parentPos =  [domPos[1],  
                      domPos[1] + p.offsetHeight,
                      p.scrollTop,
                      p.scrollHeight,
                      y, 
                      deltaScroll];
                      
    this.h.deleteDomElement(p);
    p = null;
    
    this.scrollup(parentPos,dragObj.contianerId);
    this.scrolldown(parentPos,dragObj.contianerId);
  }
  
  listSortClass.prototype.scrollup = function(pos, id) {
    var p = document.getElementById(id);
    if(pos[0] > pos[4] && pos[2] >= 0){
      p.scrollTop -= pos[5];
    }
    this.h.deleteDomElement(p);
    p = null;
  }
  
  listSortClass.prototype.scrolldown = function(pos, id) {
    var p = document.getElementById(id);
    if(pos[1] < pos[4] && (pos[2] <= pos[3])){
      p.scrollTop  += pos[5];
    }
    this.h.deleteDomElement(p);
    p = null;
  }

  
  listSortClass.prototype.onDragOver_p = function(dragObj, e, id) {
    
    var srcEl = dragObj.getEl();
    var destEl =YAHOO.util.Dom.get(id);

    // We are only concerned with list items, we ignore the dragover
    // notifications for the list.
    if(destEl.nodeName.toLowerCase() == "li"){
      var orig_p = srcEl.parentNode;
      var p = destEl.parentNode;
      if(dragObj.goingUp){
        p.insertBefore(srcEl, destEl); // insert above
      }else{
        p.insertBefore(srcEl, destEl.nextSibling); // insert below
      }
      YAHOO.util.DragDropMgr.refreshCache();
    }
    this.h.deleteDomElement(srcEl);
    srcEl = null;
    this.h.deleteDomElement(destEl);
    destEl = null;
  }
 
