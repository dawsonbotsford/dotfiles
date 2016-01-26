# Increase history size
HISTFILE=~/.zsh_history
HISTSIZE=100000
SAVEHIST=100000

# Path to your oh-my-zsh installation.
export ZSH=~/.oh-my-zsh
export PATH=/usr/local/share/npm/bin:$PATH
export PATH=$PATH:/usr/local/git/bin/
export PATH=$PATH:/usr/local/bin

export NVM_DIR=~/.nvm
source $(brew --prefix nvm)/nvm.sh

# Set name of the theme to load.
ZSH_THEME='agnoster'

# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
plugins=(git)
plugins=(heroku)
# plugins=(vi-mode)

source $ZSH/oh-my-zsh.sh

# You may need to manually set your language environment
export LANG=en_US.UTF-8
export EDITOR='vim'

eval "$(fasd --init auto)"
alias fuck='eval $(thefuck $(fc -ln -1 | tail -n 1)); fc -R'
alias f='fuck'

#backwards search
bindkey "^R" history-incremental-search-backward

#Removes user from prompt status line
prompt_context(){}

#Yank directly to clipboard OSX
set clipboard=unnamed

########## ALIASES ###########
#Git aliases
alias g='git '
alias gs='git status'
alias ga='git add'
alias gaa='git add -A'
alias gc='git commit'
alias gch='git checkout'
alias gcm='git checkout master'

alias gp='git push'
alias gps='git push staging'
alias gpp='git push production'
alias gpo='git push origin'
alias gpom='git push origin master'
alias gpom='git push heroku master'
alias gd='git diff '
alias gb='git branch '
alias gbd='git branch -D '
alias gl='git log --graph --oneline --all'
alias g*='git add -A && git commit'

alias s='source '
alias sz='source ~/.zshrc'

alias r='rm -rf '
alias vd='vimdiff '

alias vz='vim ~/dotfiles/zshrc'
alias vv='vim ~/dotfiles/vimrc'
alias ve='vim ~/dotfiles/eslintrc'

#Colorize cat. Requies Python script "pygmentize" accessable in path
cat() {
  if command -v pygmentize > /dev/null; then
    pygmentize $1 > /dev/null 2>&1
    if [ $? -eq 0 ]; then
      pygmentize $1
    else
      command cat $1
    fi
  else
    command cat $1
  fi
}

#grip required shortcut command
gr() {
  grip $1 3003 &
  open "http://localhost:3003/"
}

#Python daemon watching
alias pydemon="nodemon --exec 'python' "
alias pyd="pydemon"

#youtube-dl mp3 alias
alias youtube-dl-mp3="youtube-dl --extract-audio --audio-format mp3 "
#
#eval "$(rbenv init -)"
#export PATH="$HOME/.rbenv/bin:$PATH"

# The next line updates PATH for the Google Cloud SDK.
source '/Users/dawsonbotsford/code/swim/.gloud/google-cloud-sdk/path.zsh.inc'
# The next line enables shell command completion for gcloud.
source '/Users/dawsonbotsford/code/swim/.gloud/google-cloud-sdk/completion.zsh.inc'

alias ct="cd /tmp"
alias daws="python -mwebbrowser https://github.com/dawsonbotsford?tab=repositories"







###-begin-npm-completion-###
#
# npm command completion script
#
# Installation: npm completion >> ~/.bashrc  (or ~/.zshrc)
# Or, maybe: npm completion > /usr/local/etc/bash_completion.d/npm
#

if type complete &>/dev/null; then
  _npm_completion () {
    local words cword
    if type _get_comp_words_by_ref &>/dev/null; then
      _get_comp_words_by_ref -n = -n @ -w words -i cword
    else
      cword="$COMP_CWORD"
      words=("${COMP_WORDS[@]}")
    fi

    local si="$IFS"
    IFS=$'\n' COMPREPLY=($(COMP_CWORD="$cword" \
                           COMP_LINE="$COMP_LINE" \
                           COMP_POINT="$COMP_POINT" \
                           npm completion -- "${words[@]}" \
                           2>/dev/null)) || return $?
    IFS="$si"
  }
  complete -o default -F _npm_completion npm
elif type compdef &>/dev/null; then
  _npm_completion() {
    local si=$IFS
    compadd -- $(COMP_CWORD=$((CURRENT-1)) \
                 COMP_LINE=$BUFFER \
                 COMP_POINT=0 \
                 npm completion -- "${words[@]}" \
                 2>/dev/null)
    IFS=$si
  }
  compdef _npm_completion npm
elif type compctl &>/dev/null; then
  _npm_completion () {
    local cword line point words si
    read -Ac words
    read -cn cword
    let cword-=1
    read -l line
    read -ln point
    si="$IFS"
    IFS=$'\n' reply=($(COMP_CWORD="$cword" \
                       COMP_LINE="$line" \
                       COMP_POINT="$point" \
                       npm completion -- "${words[@]}" \
                       2>/dev/null)) || return $?
    IFS="$si"
  }
  compctl -K _npm_completion npm
fi
###-end-npm-completion-###
