#!/bin/bash
############################
# Creates symlinks from the home directory to any desired dotfiles in ~/dotfiles
############################

dir="$HOME/Dropbox/dotfiles/link" # dotfiles directory
files="vimrc zshrc vim"    # list of files/folders to symlink in homedir

cd "$dir" || exit

# move any existing dotfiles in homedir to dotfiles_old directory, then create symlinks 
for file in $files; do
  rm ~/.$file
  ln -s "$dir/$file" ~/.$file
done

# link neovimrc
mkdir ~/.config
ln -s ~/.vim ~/.config/nvim
ln -s ~/.vimrc ~/.config/nvim/init.vim
