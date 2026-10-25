import {renderPublishedHTML} from '../seo.mjs';
// Run explicitly with an existing GitHub credential on stdin; nothing secret is logged.
import {GitHubPublisher,contentSignature,decodeText} from '../admin/core.mjs';
import {readFileSync} from 'node:fs';
let token='';for await(const chunk of process.stdin)token+=chunk;
const client=new GitHubPublisher(token);token='';
const schema=JSON.parse(readFileSync(new URL('../content.json',import.meta.url),'utf8'));
const {file}=await client.connect();
if(contentSignature(file.content)!==contentSignature(schema))throw new Error('Remote content differs; do not overwrite.');
const result=await client.publish(file.content,file.sha,schema);
const verified=await client.read();
if(contentSignature(verified.content)!==contentSignature(file.content))throw new Error('Published content did not verify.');
const raw=await client.request(`contents/index.html?ref=${result.commit.sha}`);
const html=decodeText(raw.content);
if(html!==renderPublishedHTML(readFileSync(new URL('../index.html',import.meta.url),'utf8'),file.content))throw new Error('Static HTML did not match the published dashboard content.');
console.log(JSON.stringify({result:'Dashboard publisher verified content and crawlable HTML against GitHub; content unchanged',commit:result.commit.sha}));
