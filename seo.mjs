import {getCollections,renderAllCollections} from './collections.mjs?v=balanced-20261028-final';
export const SITE_URL = 'https://akramtaha98.github.io/';
const value = (content,key,fallback='') => content?.fields?.[key]?.value ?? fallback;
export function escapeHTML(text) {
  return String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
}
export function profileGraph(content) {
  const name=value(content,'seo-name','Akram Taha Zeyad');
  const sameAs=[...new Set(getCollections(content).profiles.filter(profile=>profile.identity&&/^https:\/\//.test(profile.url)).map(profile=>profile.url))];
  return {
    '@context':'https://schema.org',
    '@graph':[
      {'@type':'WebSite','@id':`${SITE_URL}#website`,url:SITE_URL,name:`${name} — Academic Portfolio`,inLanguage:'en'},
      {'@type':'ProfilePage','@id':`${SITE_URL}#profile`,url:SITE_URL,name:value(content,'field-002'),description:value(content,'field-001'),isPartOf:{'@id':`${SITE_URL}#website`},mainEntity:{'@id':`${SITE_URL}#person`}},
      {'@type':'Person','@id':`${SITE_URL}#person`,name,url:SITE_URL,description:value(content,'field-001'),jobTitle:value(content,'seo-role'),affiliation:{'@type':'CollegeOrUniversity',name:value(content,'seo-organization')},sameAs}
    ]
  };
}
export function profileJSON(content) {
  return JSON.stringify(profileGraph(content),null,2).replaceAll('<','\\u003c');
}
function replaceAttribute(tag,attribute,value) {
  const pattern=new RegExp(`\\b${attribute}="[^"]*"`);
  const safe=`${attribute}="${escapeHTML(value)}"`;
  return pattern.test(tag)?tag.replace(pattern,()=>safe):tag.replace(/\/?\s*>$/,ending=>` ${safe}${ending}`);
}
export function renderPublishedHTML(template,content) {
  let output=template.replace(/(<site-copy\b[^>]*\bdata-copy="([^"]+)"[^>]*>)[\s\S]*?(<\/site-copy>)/g,(match,start,key,end)=>content.fields[key]?start+escapeHTML(content.fields[key].value)+end:match);
  output=output.replace(/<[^!\/][^>]*\bdata-(?:url|label|meta|value)="[^"]+"[^>]*>/g,tag=>{
    for(const [marker,attribute] of [['url','href'],['label','aria-label'],['meta','content'],['value','value']]){
      const key=tag.match(new RegExp(`\\bdata-${marker}="([^"]+)"`))?.[1];
      if(key&&content.fields[key])tag=replaceAttribute(tag,attribute,content.fields[key].value);
    }
    return tag;
  });
  output=output.replace(/(<title\b[^>]*\bdata-title="([^"]+)"[^>]*>)[\s\S]*?(<\/title>)/g,(match,start,key,end)=>content.fields[key]?start+escapeHTML(content.fields[key].value)+end:match);
  const title=value(content,'field-002'),description=value(content,'field-001'),name=value(content,'seo-name');
  output=output.replace(/<meta\b[^>]*(?:property|name)="(?:og:title|twitter:title|og:description|twitter:description|og:site_name)"[^>]*>/g,tag=>{
    const property=tag.match(/(?:property|name)="([^"]+)"/)?.[1];
    return replaceAttribute(tag,'content',property.endsWith(':title')?title:property.endsWith(':description')?description:name);
  });
  output=output.replace(/(<script\b[^>]*\bid="profile-structured-data"[^>]*>)[\s\S]*?(<\/script>)/,(match,start,end)=>start+profileJSON(content)+end);
  if(!output.includes('id="profile-structured-data"')||!output.includes('rel="canonical"'))throw new Error('The website SEO template is incomplete. Reload the editor after the latest deployment.');
  return renderAllCollections(output,content);
}
