/*
 *     The TUMi app provides a modern way of managing events for an esn section.
 *     Copyright (C) 2019  Lukas Heddendorp
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Action, Actions, createSelector, State, StateContext, Store } from '@ngxs/store';
import { first, tap } from 'rxjs/operators';
import { Student, UserService } from '../services/user.service';
import { LoadUser } from './users.actions';

export interface UsersStateModel {
  users: { [id: string]: Student };
  ids: string[];
  selectedId: string | null;
  loaded: boolean;
  filterForm: {
    model: any;
    dirty: boolean;
    status: string;
    errors: any;
  };
}

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    users: {},
    ids: [],
    selectedId: null,
    filterForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {}
    },
    loaded: false
  }
})
export class UsersState {
  constructor(private store: Store, private userService: UserService, private actions$: Actions) {}

  static userList(ids: string[]) {
    return createSelector(
      [UsersState],
      (state: UsersStateModel) => ids.map(id => state.users[id])
    );
  }

  @Action(LoadUser)
  loadUser(ctx: StateContext<UsersStateModel>, action: LoadUser) {
    return this.userService.getUser(action.userId).pipe(
      first(),
      tap(user =>
        ctx.patchState({
          ids: [...ctx.getState().ids, user.id],
          users: { ...ctx.getState().users, [user.id]: user },
          loaded: true
        })
      )
    );
  }
}
