import { finalize } from 'rxjs/operators';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { ControlContainer } from '@angular/forms';
import { GroupService } from '../../shared/group.service';
import { UserService } from '../../shared/user.service';

@Component({
    selector: 'app-scrum-poker-join-group-dialog',
    templateUrl: './join-group-dialog.component.html',
})
export class JoinGroupDialogComponent {
    public formError: String;
    public isLoading: Boolean = false;
    public password: String = '';

    constructor(
        private _groupService: GroupService,
        private _snackBar: MatSnackBar,
        private _mdDialogRef: MatDialogRef<JoinGroupDialogComponent>,
        private _userService: UserService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    public onSubmit(groupJoinForm: ControlContainer): void {
        if (!groupJoinForm.valid) {
            return;
        }
        this.formError = undefined;
        this.isLoading = true;

        this._groupService.join(this.data.groupId, this.password)
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe(() => {
                this._userService.getOwnUser().addGroupId(this.data.groupId);
                this._snackBar.open('Group successfully joined', null, {
                    duration: 2000
                });
                this._mdDialogRef.close();
            }, error => {

                switch(error) {
                    case 'invalid password':
                        this.formError = 'Invalid password. Please try again.';
                        break;
                    default:
                        this.formError = 'Unknown error. Please try again.';
                }
            });
    }

    public close() {
        this._mdDialogRef.close();
    }
}
