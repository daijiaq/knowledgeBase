 | `/src/entry-client.ts`  | �ͻ�������ļ�             
| `/src/entry-server.ts`  | SSR �������Ⱦ����ļ�       
| `/ssr-server/index.cjs` | SSR ���������ű���Express�� 
| `/dist/`                | Vite ������Ŀͻ��˾�̬��Դ    
| `/dist-ssr/`            | SSR �������ɵķ���� JS ģ��  
npm run build               # �����ͻ�����Դ������� dist/
npm run build:ssr           # ���� SSR �������ڣ������dist-ssr/
node ssr-server/index.cjs   #����ssr����
http://localhost:3001       #��������ʵ�ַ
ֱ����npm run dev����ssrҲ����

