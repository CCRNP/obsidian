
## 虚拟机

### 创建目录
mkdir -p /tmp/megatron_deps && cd /tmp/megatron_deps

### 下载 megatron-core 及其所有依赖
pip download megatron-core -d . --python-version 3.11 --platform manylinux_2_28_aarch64 --only-binary :all:

### 额外下载 flask-restful（ megatron-core 依赖它）
pip download flask-restful -d . --python-version 3.11 --platform manylinux_2_28_aarch64 --only-binary :all:

### 打包并传到本地
cd /tmp
tar -czf megatron_full_deps.tar.gz megatron_deps/
scp root@<虚拟机IP>:/path/to/file /本地/路径/

## 本地
把打包好的文件拖到910b

## 910b
### 解压安装
tar -xzf megatron_full_deps.tar.gz
cd megatron_deps
pip install --no-index --find-links=. megatron-core