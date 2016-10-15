(function(window,document){
	var self = this;

	this.get_elements = function(){
	  var elems =[];

	  if(document.querySelectorAll) {
	  	var match_els = document.querySelectorAll('[autocolumn]');
		for(var i = 0; i < match_els.length; i++){
			elems.push(match_els[i]);
		}
	  }
	  else {
	  	var allElements = document.getElementsByTagName('*');
	  	for (var i = 0, n = allElements.length; i < n; i++)
	  	{
	    	if (allElements[i].getAttribute('autocolumn') !== null)
	    	{
	      		// Element exists with attribute. Add to array.
	      		elems.push(allElements[i]);
	    	}
	  	}
	  }
	  return elems;
	}

	this.update_layout = function(){
		// in this area we find the best equilbrium

		// maximum items that can be placed in the stage
		for(i in self.elems){
			var el = self.elems[i];
			var el_w = el.clientWidth;
			var dim = el.autocolumn;

			var max_n = (el_w+dim.margin)/(dim.minWidth+dim.margin);
			var min_n = (el_w+dim.margin)/(dim.maxWidth+dim.margin);
			max_n = Math.floor(max_n);
			min_n = Math.floor(min_n);

			/* get the optimum count and optimum width the optimum width 
		 	will be the closest to actual width */
		 	var opt_n,opt_width,min_dist=99999;

		 	for(k = min_n;k<=max_n;k++){
		 		var itm_width = (el_w-(k-1)*dim.margin)/k;
		 		var dist = Math.abs(itm_width-dim.width);
		 		if(dist < min_dist && itm_width < dim.maxWidth){
		 			opt_n = k;
		 			opt_width =itm_width;
		 			min_dist = dist;
		 		}
		 	}

		 	if(opt_n == dim.count){
		 		continue;
		 	} else {
		 		dim.count = opt_n;	
		 	}
		 	
			for(j in el.children){
				if(el.children[j].style){
					el.children[j].style.width = (opt_width/el_w)*100+'%';
					el.children[j].style.marginRight = 0;
					el.children[j].style.marginLeft = j%opt_n==0 ? 0 : (dim.margin/el_w)*100+'%';
				}
			}
		}
	}

	this.init = function(){

		self.elems = this.get_elements();

		// get the card max-width min-width and expected width
		for(i in self.elems){
			if(self.elems[i].children.length ==0){
				continue;
			}
			var first_child = self.elems[i].children[0];
			var dimensions= {};

			dimensions.width = first_child.offsetWidth;

			// get min and max widths of elems
			first_child.style.width = 0;
			if(first_child.offsetWidth==0) {
				dimensions.minWidth = 100;
			}
			else {
				dimensions.minWidth = first_child.offsetWidth;
			}
				
			first_child.style.width = 9999;
			if(first_child.offsetWidth < self.elems[i].clientWidth) {
				dimensions.maxWidth = first_child.offsetWidth;
			}
			else {
				dimensions.maxWidth = self.elems[i].offsetWidth;
			}
			var margin;
			if(window.getComputedStyle){
				margin= window.getComputedStyle(first_child, null).marginRight;
				margin =margin.match(/\d/g).join('');
			} else {
				margin = 20;
			}
			
			dimensions.margin = 2*margin;
			dimensions.count = 0;
			self.elems[i].autocolumn = dimensions;
		}

		self.update_layout();
	}
	this.resize_handler = function(){
		setTimeout(self.update_layout,50);
	}
	this.load_handler = function(){
		setTimeout(self.init,0);
	}
	if(window.addEventListener){
		window.addEventListener('resize', self.resize_handler, true);
		window.addEventListener('load', self.load_handler,true);
	}
	else {
		window.attachEvent('onresize',self.resize_handler);
		window.attachEvent('onload',self.load_handler);
	}
})(window,document);
