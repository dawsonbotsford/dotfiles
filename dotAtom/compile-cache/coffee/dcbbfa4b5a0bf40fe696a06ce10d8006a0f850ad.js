(function() {
  var SpecHelper, SyncSettings, fs, os, path, run;

  SyncSettings = require('../lib/sync-settings');

  SpecHelper = require('./spec-helpers');

  run = SpecHelper.callAsync;

  fs = require('fs');

  path = require('path');

  os = require('os');

  describe("SyncSettings", function() {
    describe("low-level", function() {
      return describe("::fileContent", function() {
        var tmpPath;
        tmpPath = path.join(os.tmpdir(), 'atom-sync-settings.tmp');
        it("returns null for not existing file", function() {
          return expect(SyncSettings.fileContent(tmpPath)).toBeNull();
        });
        it("returns null for empty file", function() {
          fs.writeFileSync(tmpPath, "");
          try {
            return expect(SyncSettings.fileContent(tmpPath)).toBeNull();
          } finally {
            fs.unlinkSync(tmpPath);
          }
        });
        return it("returns content of existing file", function() {
          var text;
          text = "alabala portocala";
          fs.writeFileSync(tmpPath, text);
          try {
            return expect(SyncSettings.fileContent(tmpPath)).toEqual(text);
          } finally {
            fs.unlinkSync(tmpPath);
          }
        });
      });
    });
    return describe("high-level", function() {
      var GIST_ID_CONFIG, TOKEN_CONFIG;
      TOKEN_CONFIG = 'sync-settings.personalAccessToken';
      GIST_ID_CONFIG = 'sync-settings.gistId';
      window.resetTimeouts();
      SyncSettings.activate();
      window.advanceClock();
      beforeEach(function() {
        this.token = process.env.GITHUB_TOKEN || atom.config.get(TOKEN_CONFIG);
        atom.config.set(TOKEN_CONFIG, this.token);
        return run(function(cb) {
          var gistSettings;
          gistSettings = {
            "public": false,
            description: "Test gist by Sync Settings for Atom https://github.com/atom-community/sync-settings",
            files: {
              README: {
                content: '# Generated by Sync Settings for Atom https://github.com/atom-community/sync-settings'
              }
            }
          };
          return SyncSettings.createClient().gists.create(gistSettings, cb);
        }, (function(_this) {
          return function(err, res) {
            expect(err).toBeNull();
            _this.gistId = res.id;
            console.log("Using Gist " + _this.gistId);
            return atom.config.set(GIST_ID_CONFIG, _this.gistId);
          };
        })(this));
      });
      afterEach(function() {
        return run((function(_this) {
          return function(cb) {
            return SyncSettings.createClient().gists["delete"]({
              id: _this.gistId
            }, cb);
          };
        })(this), function(err, res) {
          return expect(err).toBeNull();
        });
      });
      describe("::backup", function() {
        it("back up the settings", function() {
          atom.config.set('sync-settings.syncSettings', true);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return run((function(_this) {
              return function(cb) {
                return SyncSettings.createClient().gists.get({
                  id: _this.gistId
                }, cb);
              };
            })(this), function(err, res) {
              return expect(res.files['settings.json']).toBeDefined();
            });
          });
        });
        it("don't back up the settings", function() {
          atom.config.set('sync-settings.syncSettings', false);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return run((function(_this) {
              return function(cb) {
                return SyncSettings.createClient().gists.get({
                  id: _this.gistId
                }, cb);
              };
            })(this), function(err, res) {
              return expect(res.files['settings.json']).not.toBeDefined();
            });
          });
        });
        it("back up the installed packages list", function() {
          atom.config.set('sync-settings.syncPackages', true);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return run((function(_this) {
              return function(cb) {
                return SyncSettings.createClient().gists.get({
                  id: _this.gistId
                }, cb);
              };
            })(this), function(err, res) {
              return expect(res.files['packages.json']).toBeDefined();
            });
          });
        });
        it("don't back up the installed packages list", function() {
          atom.config.set('sync-settings.syncPackages', false);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return run((function(_this) {
              return function(cb) {
                return SyncSettings.createClient().gists.get({
                  id: _this.gistId
                }, cb);
              };
            })(this), function(err, res) {
              return expect(res.files['packages.json']).not.toBeDefined();
            });
          });
        });
        it("back up the user keymaps", function() {
          atom.config.set('sync-settings.syncKeymap', true);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return run((function(_this) {
              return function(cb) {
                return SyncSettings.createClient().gists.get({
                  id: _this.gistId
                }, cb);
              };
            })(this), function(err, res) {
              return expect(res.files['keymap.cson']).toBeDefined();
            });
          });
        });
        it("don't back up the user keymaps", function() {
          atom.config.set('sync-settings.syncKeymap', false);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return run((function(_this) {
              return function(cb) {
                return SyncSettings.createClient().gists.get({
                  id: _this.gistId
                }, cb);
              };
            })(this), function(err, res) {
              return expect(res.files['keymap.cson']).not.toBeDefined();
            });
          });
        });
        it("back up the user styles", function() {
          atom.config.set('sync-settings.syncStyles', true);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return run((function(_this) {
              return function(cb) {
                return SyncSettings.createClient().gists.get({
                  id: _this.gistId
                }, cb);
              };
            })(this), function(err, res) {
              return expect(res.files['styles.less']).toBeDefined();
            });
          });
        });
        it("don't back up the user styles", function() {
          atom.config.set('sync-settings.syncStyles', false);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return run((function(_this) {
              return function(cb) {
                return SyncSettings.createClient().gists.get({
                  id: _this.gistId
                }, cb);
              };
            })(this), function(err, res) {
              return expect(res.files['styles.less']).not.toBeDefined();
            });
          });
        });
        it("back up the user init.coffee file", function() {
          atom.config.set('sync-settings.syncInit', true);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return run((function(_this) {
              return function(cb) {
                return SyncSettings.createClient().gists.get({
                  id: _this.gistId
                }, cb);
              };
            })(this), function(err, res) {
              return expect(res.files['init.coffee']).toBeDefined();
            });
          });
        });
        it("don't back up the user init.coffee file", function() {
          atom.config.set('sync-settings.syncInit', false);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return run((function(_this) {
              return function(cb) {
                return SyncSettings.createClient().gists.get({
                  id: _this.gistId
                }, cb);
              };
            })(this), function(err, res) {
              return expect(res.files['init.coffee']).not.toBeDefined();
            });
          });
        });
        it("back up the user snippets", function() {
          atom.config.set('sync-settings.syncSnippets', true);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return run((function(_this) {
              return function(cb) {
                return SyncSettings.createClient().gists.get({
                  id: _this.gistId
                }, cb);
              };
            })(this), function(err, res) {
              return expect(res.files['snippets.cson']).toBeDefined();
            });
          });
        });
        it("don't back up the user snippets", function() {
          atom.config.set('sync-settings.syncSnippets', false);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return run((function(_this) {
              return function(cb) {
                return SyncSettings.createClient().gists.get({
                  id: _this.gistId
                }, cb);
              };
            })(this), function(err, res) {
              return expect(res.files['snippets.cson']).not.toBeDefined();
            });
          });
        });
        it("back up the files defined in config.extraFiles", function() {
          atom.config.set('sync-settings.extraFiles', ['test.tmp', 'test2.tmp']);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return run((function(_this) {
              return function(cb) {
                return SyncSettings.createClient().gists.get({
                  id: _this.gistId
                }, cb);
              };
            })(this), function(err, res) {
              var file, _i, _len, _ref, _results;
              _ref = atom.config.get('sync-settings.extraFiles');
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                file = _ref[_i];
                _results.push(expect(res.files[file]).toBeDefined());
              }
              return _results;
            });
          });
        });
        return it("don't back up extra files defined in config.extraFiles", function() {
          atom.config.set('sync-settings.extraFiles', void 0);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return run((function(_this) {
              return function(cb) {
                return SyncSettings.createClient().gists.get({
                  id: _this.gistId
                }, cb);
              };
            })(this), function(err, res) {
              return expect(Object.keys(res.files).length).toBe(1);
            });
          });
        });
      });
      describe("::restore", function() {
        it("updates settings", function() {
          atom.config.set('sync-settings.syncSettings', true);
          atom.config.set("some-dummy", true);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            atom.config.set("some-dummy", false);
            return run(function(cb) {
              return SyncSettings.restore(cb);
            }, function() {
              return expect(atom.config.get("some-dummy")).toBeTruthy();
            });
          });
        });
        it("doesn't updates settings", function() {
          atom.config.set('sync-settings.syncSettings', false);
          atom.config.set("some-dummy", true);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return run(function(cb) {
              return SyncSettings.restore(cb);
            }, function() {
              return expect(atom.config.get("some-dummy")).toBeTruthy();
            });
          });
        });
        it("overrides keymap.cson", function() {
          var original, _ref;
          atom.config.set('sync-settings.syncKeymap', true);
          original = (_ref = SyncSettings.fileContent(atom.keymaps.getUserKeymapPath())) != null ? _ref : "# keymap file (not found)";
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            fs.writeFileSync(atom.keymaps.getUserKeymapPath(), "" + original + "\n# modified by sync setting spec");
            return run(function(cb) {
              return SyncSettings.restore(cb);
            }, function() {
              expect(SyncSettings.fileContent(atom.keymaps.getUserKeymapPath())).toEqual(original);
              return fs.writeFileSync(atom.keymaps.getUserKeymapPath(), original);
            });
          });
        });
        return it("restores all other files in the gist as well", function() {
          atom.config.set('sync-settings.extraFiles', ['test.tmp', 'test2.tmp']);
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return run(function(cb) {
              return SyncSettings.restore(cb);
            }, function() {
              var file, _i, _len, _ref, _results;
              _ref = atom.config.get('sync-settings.extraFiles');
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                file = _ref[_i];
                expect(fs.existsSync("" + atom.config.configDirPath + "/" + file)).toBe(true);
                expect(SyncSettings.fileContent("" + atom.config.configDirPath + "/" + file)).toBe("# " + file + " (not found) ");
                _results.push(fs.unlink("" + atom.config.configDirPath + "/" + file));
              }
              return _results;
            });
          });
        });
      });
      return describe("::check for update", function() {
        beforeEach(function() {
          return atom.config.unset('sync-settings._lastBackupHash');
        });
        it("updates last hash on backup", function() {
          return run(function(cb) {
            return SyncSettings.backup(cb);
          }, function() {
            return expect(atom.config.get("sync-settings._lastBackupHash")).toBeDefined();
          });
        });
        it("updates last hash on restore", function() {
          return run(function(cb) {
            return SyncSettings.restore(cb);
          }, function() {
            return expect(atom.config.get("sync-settings._lastBackupHash")).toBeDefined();
          });
        });
        return describe("::notification", function() {
          beforeEach(function() {
            return atom.notifications.clear();
          });
          it("displays on newer backup", function() {
            return run(function(cb) {
              return SyncSettings.checkForUpdate(cb);
            }, function() {
              expect(atom.notifications.getNotifications().length).toBe(1);
              return expect(atom.notifications.getNotifications()[0].getType()).toBe('warning');
            });
          });
          return it("ignores on up-to-date backup", function() {
            return run(function(cb) {
              return SyncSettings.backup(cb);
            }, function() {
              return run(function(cb) {
                atom.notifications.clear();
                return SyncSettings.checkForUpdate(cb);
              }, function() {
                expect(atom.notifications.getNotifications().length).toBe(1);
                return expect(atom.notifications.getNotifications()[0].getType()).toBe('success');
              });
            });
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3N5bmMtc2V0dGluZ3Mvc3BlYy9zeW5jLXNldHRpbmdzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJDQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQUFmLENBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGdCQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUVBLEdBQUEsR0FBTSxVQUFVLENBQUMsU0FGakIsQ0FBQTs7QUFBQSxFQUdBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUhMLENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FKUCxDQUFBOztBQUFBLEVBS0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBTEwsQ0FBQTs7QUFBQSxFQVdBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUV2QixJQUFBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTthQUNwQixRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsWUFBQSxPQUFBO0FBQUEsUUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLElBQUwsQ0FBVSxFQUFFLENBQUMsTUFBSCxDQUFBLENBQVYsRUFBdUIsd0JBQXZCLENBQVYsQ0FBQTtBQUFBLFFBRUEsRUFBQSxDQUFHLG9DQUFILEVBQXlDLFNBQUEsR0FBQTtpQkFDdkMsTUFBQSxDQUFPLFlBQVksQ0FBQyxXQUFiLENBQXlCLE9BQXpCLENBQVAsQ0FBeUMsQ0FBQyxRQUExQyxDQUFBLEVBRHVDO1FBQUEsQ0FBekMsQ0FGQSxDQUFBO0FBQUEsUUFLQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFVB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/sync-settings/spec/sync-settings-spec.coffee
