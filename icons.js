/* Consistent decorative link arrows; labels and destinations stay native. */
window.siteContentReady.finally(()=>{
 const ns='http://www.w3.org/2000/svg';
 function replace(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];
  while(walker.nextNode()){const node=walker.currentNode;if(node.textContent.includes('↗')&&node.parentElement?.closest('a')&&!node.parentElement.closest('script,style,textarea,svg'))nodes.push(node);}
  for(const node of nodes){const parts=node.textContent.split('↗'),fragment=document.createDocumentFragment();parts.forEach((part,index)=>{if(index){const svg=document.createElementNS(ns,'svg');svg.setAttribute('class','ui-icon link-icon');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');const path=document.createElementNS(ns,'path');path.setAttribute('d','M6 18 18 6M6 6h12v12');svg.append(path);fragment.append(svg);}fragment.append(document.createTextNode(part));});node.replaceWith(fragment);}
 }
 replace(document.body);
 const observer=new MutationObserver(records=>{observer.disconnect();for(const record of records){if(record.type==='characterData')replace(record.target.parentElement);else for(const node of record.addedNodes){if(node.nodeType===1)replace(node);else if(node.nodeType===3&&node.parentElement)replace(node.parentElement);}}observer.observe(document.body,{childList:true,characterData:true,subtree:true});});
 observer.observe(document.body,{childList:true,characterData:true,subtree:true});
});
