# The install script
# Adapted from https://gist.github.com/579814

echo 'export PATH=$HOME/local/bin:$PATH' >> ~/.bashrc
echo 'export NODE_PATH=$HOME/local/lib/node_modules' >> ~/.bashrc
. ~/.bashrc

mkdir ~/local
mkdir ~/Downloads/node-latest-install

cd ~/Downloads/node-latest-install
curl http://nodejs.org/dist/node-latest.tar.gz | tar xz --strip-components=1

./configure --prefix=~/local # if SSL support is not required, use --without-ssl
make install # ok, fine, this step probably takes more than 30 seconds...