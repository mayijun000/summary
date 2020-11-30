# **jenkins配置**

1. **general配置**，勾选：**Discard old builds**，策略：**log rotation**，保持构建最大数：**10**。

   勾选：**This project is parameterized**，name：**barnch**，Parameter Type：**barnch**，Default Value：**v1.1.1**

2. **源码管理配置**

   勾选：git，Repository URL：http://192.168.200.74/front_group/shzl_pt_pc.git

   Credentials：账号密码，指定分支（为空时代表any）：

   ```javascript
   */develop
   ```

   源码库浏览器：自动

   构建环境：勾选**Delete workspace before build starts**

   ```javascript
   前端依赖包命令
   #/usr/local/bin/npm install --unsafe-perm --registry=https://registry.npm.taobao.org\
   env
   echo $action
   echo $WORKSPACE
   
   cd $WORKSPACE && /usr/local/bin/npm install --unsafe-perm --registry=https://registry.npm.taobao.org \
   && \
   rm -rf ../../node_modules-web && mv node_modules ../../node_modules-web
   
   前端构建工程命令
   
   #######变量定义######
   #远程主机IP
   REMOTE_HOST=192.168.200.75
   #远程主机HTML目录
   REMOTE_HTML_HOME=/home/nginx_html/pt_pc
   
   cd $WORKSPACE && cp -pr /root/.jenkins/node_modules-web ./node_modules \
   &&
   npm run dll \
   &&
   npm run mod grid_management_platform basic_data_platform command_platform common artificial_reports_platform science_platform service_platform video_platform\
   &&
   npm run build \
   &&
   cd $WORKSPACE \
   &&
   /usr/local/bin/npm run build \
   &&
   cd $WORKSPACE \
   &&
   DIST_DIR=`ls -d dist` && echo "$DIST_DIR" \
   &&
   ssh root@$REMOTE_HOST "[[ -d "$REMOTE_HTML_HOME" ]] && echo "$REMOTE_HTML_HOME There are" || mkdir -pv $REMOTE_HTML_HOME" \
   &&
   #scp -pr $DIST_DIR root@$REMOTE_HOST:$REMOTE_HTML_HOME
   	if [  -d "$DIST_DIR" ];then
           ssh root@$REMOTE_HOST "cd $REMOTE_HTML_HOME && ls -l && [[  -d "$DIST_DIR" ]] && tar -zcf $DIST_DIR.tar.gz $DIST_DIR && rm -rf $DIST_DIR && ls -l" \
           &&
   		scp -pr $DIST_DIR root@$REMOTE_HOST:$REMOTE_HTML_HOME \
           ||
           scp -pr $DIST_DIR root@$REMOTE_HOST:$REMOTE_HTML_HOME
   	else
   		echo "$DIST_DIR Did not find..."
   	fi
   ```

   