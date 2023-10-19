# Allow dirty to keep git clean when testing multiple times
# https://stackoverflow.com/questions/56773528/repository-is-not-clean-please-commit-or-stash-any-changes-before-updating-in-a
ng update @angular/core@14 @angular/cli@14 --allow-dirty
ng update @angular/core@15 @angular/cli@15 --allow-dirty
ng update @angular/core@16 @angular/cli@16 --allow-dirty
