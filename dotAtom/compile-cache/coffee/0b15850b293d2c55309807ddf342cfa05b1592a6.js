(function() {
  var fs, path, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  describe('ShowTodo opening panes and executing commands', function() {
    var activationPromise, executeCommand, showTodoModule, showTodoPane, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1], showTodoModule = _ref[2], showTodoPane = _ref[3];
    executeCommand = function(callback) {
      var wasVisible;
      wasVisible = showTodoModule != null ? showTodoModule.showTodoView.isVisible() : void 0;
      atom.commands.dispatch(workspaceElement, 'todo-show:find-in-project');
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(function() {
        waitsFor(function() {
          if (wasVisible) {
            return !showTodoModule.showTodoView.isVisible();
          }
          return !showTodoModule.showTodoView.loading && showTodoModule.showTodoView.isVisible();
        });
        return runs(function() {
          showTodoPane = atom.workspace.paneForItem(showTodoModule.showTodoView);
          return callback();
        });
      });
    };
    beforeEach(function() {
      atom.project.setPaths([path.join(__dirname, 'fixtures/sample1')]);
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      return activationPromise = atom.packages.activatePackage('todo-show').then(function(opts) {
        return showTodoModule = opts.mainModule;
      });
    });
    describe('when the show-todo:find-in-project event is triggered', function() {
      it('attaches and then detaches the pane view', function() {
        expect(atom.packages.loadedPackages['todo-show']).toBeDefined();
        expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          expect(showTodoPane.parent.orientation).toBe('horizontal');
          return executeCommand(function() {
            return expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
          });
        });
      });
      it('can open in vertical split', function() {
        atom.config.set('todo-show.openListInDirection', 'down');
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          return expect(showTodoPane.parent.orientation).toBe('vertical');
        });
      });
      it('can open ontop of current view', function() {
        atom.config.set('todo-show.openListInDirection', 'ontop');
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          return expect(showTodoPane.parent.orientation).not.toExist();
        });
      });
      it('has visible elements in view', function() {
        return executeCommand(function() {
          var element;
          element = showTodoModule.showTodoView.find('td').last();
          expect(element.text()).toEqual('sample.js');
          return expect(element.isVisible()).toBe(true);
        });
      });
      it('persists pane width', function() {
        return executeCommand(function() {
          var newFlex, originalFlex;
          originalFlex = showTodoPane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          expect(showTodoModule.showTodoView).toBeVisible();
          showTodoPane.setFlexScale(newFlex);
          return executeCommand(function() {
            expect(showTodoPane).not.toExist();
            expect(showTodoModule.showTodoView).not.toBeVisible();
            return executeCommand(function() {
              expect(showTodoPane.getFlexScale()).toEqual(newFlex);
              return showTodoPane.setFlexScale(originalFlex);
            });
          });
        });
      });
      it('does not persist pane width if asked not to', function() {
        atom.config.set('todo-show.rememberViewSize', false);
        return executeCommand(function() {
          var newFlex, originalFlex;
          originalFlex = showTodoPane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          showTodoPane.setFlexScale(newFlex);
          return executeCommand(function() {
            return executeCommand(function() {
              expect(showTodoPane.getFlexScale()).not.toEqual(newFlex);
              return expect(showTodoPane.getFlexScale()).toEqual(originalFlex);
            });
          });
        });
      });
      return it('persists horizontal pane height', function() {
        atom.config.set('todo-show.openListInDirection', 'down');
        return executeCommand(function() {
          var newFlex, originalFlex;
          originalFlex = showTodoPane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          showTodoPane.setFlexScale(newFlex);
          return executeCommand(function() {
            expect(showTodoPane).not.toExist();
            return executeCommand(function() {
              expect(showTodoPane.getFlexScale()).toEqual(newFlex);
              return showTodoPane.setFlexScale(originalFlex);
            });
          });
        });
      });
    });
    describe('when save-as button is clicked', function() {
      it('saves the list in markdown and opens it', function() {
        var expectedFilePath, expectedOutput, outputPath;
        outputPath = temp.path({
          suffix: '.md'
        });
        expectedFilePath = atom.project.getDirectories()[0].resolve('../saved-output.md');
        expectedOutput = fs.readFileSync(expectedFilePath).toString();
        atom.config.set('todo-show.sortBy', 'Type');
        expect(fs.isFileSync(outputPath)).toBe(false);
        executeCommand(function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
          return showTodoModule.showTodoView.saveAs();
        });
        waitsFor(function() {
          var _ref1;
          return fs.existsSync(outputPath) && ((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0) === fs.realpathSync(outputPath);
        });
        return runs(function() {
          expect(fs.isFileSync(outputPath)).toBe(true);
          return expect(atom.workspace.getActiveTextEditor().getText()).toBe(expectedOutput);
        });
      });
      return it('saves another list sorted differently in markdown', function() {
        var outputPath;
        outputPath = temp.path({
          suffix: '.md'
        });
        atom.config.set('todo-show.findTheseRegexes', ['TODOs', '/\\b@?TODO:?\\s(.+$)/g']);
        atom.config.set('todo-show.showInTable', ['Text', 'Type', 'File', 'Line']);
        atom.config.set('todo-show.sortBy', 'File');
        expect(fs.isFileSync(outputPath)).toBe(false);
        executeCommand(function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
          return showTodoModule.showTodoView.saveAs();
        });
        waitsFor(function() {
          var _ref1;
          return fs.existsSync(outputPath) && ((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0) === fs.realpathSync(outputPath);
        });
        return runs(function() {
          expect(fs.isFileSync(outputPath)).toBe(true);
          return expect(atom.workspace.getActiveTextEditor().getText()).toBe("- Comment in C __TODOs__ [sample.c](sample.c) _:5_\n- This is the first todo __TODOs__ [sample.js](sample.js) _:3_\n- This is the second todo __TODOs__ [sample.js](sample.js) _:20_\n");
        });
      });
    });
    describe('when core:refresh is triggered', function() {
      return it('refreshes the list', function() {
        return executeCommand(function() {
          atom.commands.dispatch(workspaceElement.querySelector('.show-todo-preview'), 'core:refresh');
          expect(showTodoModule.showTodoView.loading).toBe(true);
          expect(showTodoModule.showTodoView.find('.markdown-spinner')).toBeVisible();
          waitsFor(function() {
            return !showTodoModule.showTodoView.loading;
          });
          return runs(function() {
            expect(showTodoModule.showTodoView.find('.markdown-spinner')).not.toBeVisible();
            return expect(showTodoModule.showTodoView.loading).toBe(false);
          });
        });
      });
    });
    return describe('when the show-todo:find-in-open-files event is triggered', function() {
      beforeEach(function() {
        atom.commands.dispatch(workspaceElement, 'todo-show:find-in-open-files');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return waitsFor(function() {
            return !showTodoModule.showTodoView.loading && showTodoModule.showTodoView.isVisible();
          });
        });
      });
      it('does not show any results with no open files', function() {
        var element;
        element = showTodoModule.showTodoView.find('p').last();
        expect(showTodoModule.showTodoView.getTodos()).toHaveLength(0);
        expect(element.text()).toContain('No results...');
        return expect(element.isVisible()).toBe(true);
      });
      return it('only shows todos from open files', function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        waitsFor(function() {
          return !showTodoModule.showTodoView.loading;
        });
        return runs(function() {
          var todos;
          todos = showTodoModule.showTodoView.getTodos();
          expect(todos).toHaveLength(1);
          expect(todos[0].type).toBe('TODOs');
          expect(todos[0].text).toBe('Comment in C');
          return expect(todos[0].file).toBe('sample.c');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3Nob3ctdG9kby1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxjQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLCtDQUFULEVBQTBELFNBQUEsR0FBQTtBQUN4RCxRQUFBLHVGQUFBO0FBQUEsSUFBQSxPQUFzRSxFQUF0RSxFQUFDLDBCQUFELEVBQW1CLDJCQUFuQixFQUFzQyx3QkFBdEMsRUFBc0Qsc0JBQXRELENBQUE7QUFBQSxJQUlBLGNBQUEsR0FBaUIsU0FBQyxRQUFELEdBQUE7QUFDZixVQUFBLFVBQUE7QUFBQSxNQUFBLFVBQUEsNEJBQWEsY0FBYyxDQUFFLFlBQVksQ0FBQyxTQUE3QixDQUFBLFVBQWIsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QywyQkFBekMsQ0FEQSxDQUFBO0FBQUEsTUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLGtCQUFIO01BQUEsQ0FBaEIsQ0FGQSxDQUFBO2FBR0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFFBQUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsSUFBbUQsVUFBbkQ7QUFBQSxtQkFBTyxDQUFBLGNBQWUsQ0FBQyxZQUFZLENBQUMsU0FBNUIsQ0FBQSxDQUFSLENBQUE7V0FBQTtpQkFDQSxDQUFBLGNBQWUsQ0FBQyxZQUFZLENBQUMsT0FBN0Is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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/todo-show/spec/show-todo-spec.coffee
