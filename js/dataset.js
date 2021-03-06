// jquery.dataset v0.1.0 -- HTML5 dataset jQuery plugin
// http://orangesoda.net/jquery.dataset.html

// Copyright (c) 2009, Ben Weaver.  All rights reserved.
// This software is issued "as is" under a BSD license
// <http://orangesoda.net/license.html>.  All warrenties disclaimed.

//  The HTML5 specification allows elements to have custom data
//  attributes that are prefixed with `data-'.  They may be
//  conveniently accessed through an element's `dataset' property.
//  This plugin provides similar functionality.
//
//  The methods in the plugin are designed to be similar to the
//  built-in `attr' and `data' methods.  All names are without the
//  `data-' prefix.

//  These methods are defined:
//
//    dataset()
//      Return an object with all custom attribute (name, value) items.
//
//    dataset(name)
//      Return the value of the attribute `data-NAME'.
//
//    dataset(name, value)
//      Set the value of attribtue `data-NAME' to VALUE.
//
//    dataset({...})
//      Set many custom attributes at once.
//
//    removeDataset(name)
//      Remove the attribute `data-NAME'.
//
//    removeDataset([n1, n2, ...])
//      Remove the attributes `data-N1', `data-N2', ...
(function($){var e='data-',PATTERN=/^data\-(.*)$/;function dataset(a,b){if(b!==undefined){return this.attr(e+a,b)}switch(typeof a){case'string':return this.attr(e+a);case'object':return set_items.call(this,a);case'undefined':return get_items.call(this);default:throw'dataset: invalid argument '+a;}}function get_items(){return this.foldAttr(function(a,b,c){var d=PATTERN.exec(this.name);if(d)c[d[1]]=this.value})}function set_items(a){for(var b in a){this.attr(e+b,a[b])}return this}function remove(a){if(typeof a=='string'){return this.removeAttr(e+a)}return remove_names(a)}function remove_names(a){var b,length=a&&a.length;if(length===undefined){for(b in a){this.removeAttr(e+b)}}else{for(b=0;b<length;b++){this.removeAttr(e+a[b])}}return this}$.fn.dataset=dataset;$.fn.removeDataset=remove_names})(jQuery);(function($){function each_attr(a){if(this.length>0){$.each(this[0].attributes,a)}return this}function fold_attr(a,b){return fold((this.length>0)&&this[0].attributes,a,b)}function fold(a,b,c){var d=a&&a.length;if(c===undefined)c={};if(!a)return c;if(d!==undefined){for(var i=0,value=a[i];(i<d)&&(b.call(value,i,value,c)!==false);value=a[++i]){}}else{for(var e in a){if(b.call(a[e],e,a[e],c)===false)break}}return c}function fold_jquery(a,b){if(b===undefined)b=[];return fold(this,a,b)}$.fn.eachAttr=each_attr;$.fn.foldAttr=fold_attr;$.fn.fold=fold_jquery;$.fold=fold})(jQuery);