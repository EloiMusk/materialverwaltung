import router from '@/router';
import {User} from 'firebase/auth';
import Vue from 'vue';
import Vuex from 'vuex';
import Alert, {triggerAlert} from "@/models/Alert";
import AlertType from "@/models/AlertType";
import Item from "@/models/Item";
import DbService from "@/store/DbService";
import ItemFilter from "@/models/ItemFilter";
import Tag from "@/models/Tag";
import Group from "@/models/Group";


Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: undefined as User | null | undefined,
        alert: new Alert('', AlertType.info, false),
        loading: false,
        items: [] as Item[],
        itemFilter: new ItemFilter(),
        currentItem: Item.empty() as Item | undefined,
        tags: [] as Tag[],
        groups: [] as Group[],
        currentGroup: Group.empty() as Group | undefined,
        editGroup: Group.empty() as Group | undefined,
    },
    getters: {
        isLoggedIn(state) {
            return state.user !== null && state.user !== undefined;
        },
        user(state) {
            return state.user;
        },
        alert(state) {
            return state.alert;
        },
        showAlert(state) {
            return state.alert.show;
        },
        loading(state) {
            return state.loading;
        },
        objects(state) {
            return state.items;
        },
        currentItem(state) {
            return state.currentItem;
        },
        tags(state) {
            return state.tags;
        },
        groups(state) {
            return state.groups;
        },
        currentGroup(state) {
            return state.currentGroup;
        },
        editGroup(state) {
            return state.editGroup;
        }
    },
    mutations: {
        SET_USER(state, user) {
            const oldUser = state.user;
            state.user = user;
            if (user === null && oldUser !== undefined) {
                router.push('login').then();
            }
        },
        SET_ALERT(state, alert) {
            state.alert = alert;
            state.alert.show = true;
        },
        SET_SHOW_ALERT(state, show) {
            if (!show) {
                state.alert = {message: '', type: AlertType.info, show: false} as Alert;
            }
            state.alert.show = show;
        },
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        SET_CURRENT_ITEM(state, item) {
            state.currentItem = item;
        },
        ADD_ITEM(state, item: Item) {
            state.items.push(item);
        },
        UPDATE_ITEM(state, item: Item) {
            const index = state.items.findIndex(i => i.id === item.id);
            state.items.splice(index, 1, item);
        },
        DELETE_ITEM(state, item: Item) {
            const index = state.items.findIndex(i => i.id === item.id);
            state.items.splice(index, 1);
        },
        SET_ITEMS(state, items: Item[]) {
            state.items = items;
        },
        SET_ITEM_FILTER(state, filter) {
            state.itemFilter = filter;
        },
        SET_TAGS(state, tags: Tag[]) {
            state.tags = tags;
        },
        ADD_TAG(state, tag: Tag) {
            state.tags.push(tag);
        },
        SET_CURRENT_GROUP(state, group: Group) {
            state.currentGroup = group;
            localStorage.setItem('currentGroup', group.id as string);
            triggerAlert('Group changed to: ' + group.name, AlertType.info);

        },
        SET_GROUPS(state, groups: Group[]) {
            state.groups = groups;
        },
        ADD_GROUP(state, group: Group) {
            state.groups.push(group);
        },
        SET_EDIT_GROUP(state, group: Group) {
            state.editGroup = group;
        }
    },
    actions: {
        fetchItems(context) {
            context.commit('SET_LOADING', true);
            DbService.getItems(context.state.itemFilter).then((items: Item[]) => {
                context.commit('ADD_ITEM', items);
            }).catch(() => {
                triggerAlert('Error fetching items', AlertType.error);
            }).finally(() => {
                context.commit('SET_LOADING', false);
            });
        },
        fetchItem(context, itemId: string) {
            context.commit('SET_LOADING', true);
            DbService.getItem(itemId).then((item: Item) => {
                context.commit('SET_CURRENT_ITEM', item);
            }).catch(() => {
                triggerAlert('Error fetching item', AlertType.error);
            }).finally(() => {
                context.commit('SET_LOADING', false);
            }).then();
        },
        clearCurrentItem(context) {
            context.commit('SET_CURRENT_ITEM', Item.empty());
        },
        createItem(context) {
            DbService.createItem(context.state.currentItem).then((item: Item | void) => {
                context.commit('ADD_ITEM', item);
                triggerAlert('Item created', AlertType.success);
            }).catch((error) => {
                console.log(error);
                triggerAlert('Error creating item', AlertType.error);
            });
        },
        fetchTags(context) {
            DbService.getTags().then((tags: Tag[]) => {
                context.commit('SET_TAGS', tags);
            }).catch(() => {
                triggerAlert('Error fetching tags', AlertType.error);
            }).then();
        },
        createTag(context, tag: Tag) {
            DbService.createTag(tag as Tag).then(() => {
                context.dispatch('fetchTags');
                triggerAlert('Tag created', AlertType.success);
            }).catch((error) => {
                console.log(error);
                triggerAlert('Error creating tag', AlertType.error);
            });
        },
        createGroup(context, group?: Group) {
            if (!group) group = context.getters.editGroup;
            DbService.createGroup(group as Group).then(() => {
                context.dispatch('fetchGroups').then(
                    () => {
                        router.push('.').then(() => {
                            triggerAlert('Group created', AlertType.success);
                            context.dispatch('clearEditGroup');
                        })
                    })
            }).catch((error) => {
                console.log(error);
                triggerAlert('Error creating group', AlertType.error);
                return false;
            });
        },
        fetchCurrentGroup(context, groupId
            :
            string
        ) {
            DbService.getGroup(groupId).then((group: Group) => {
                context.commit('SET_CURRENT_GROUP', group);
            }).catch((e) => {
                console.log(e)
                triggerAlert('Error fetching group', AlertType.error);
            }).then();
        }
        ,
        fetchGroups(context) {
            DbService.getGroups().then((groups: Group[]) => {
                context.commit('SET_GROUPS', groups);
            }).catch(() => {
                triggerAlert('Error fetching groups', AlertType.error);
            }).then();
        }
        ,
        clearEditGroup(context) {
            context.commit('SET_EDIT_GROUP', Group.empty());
        }
    }
})
;


