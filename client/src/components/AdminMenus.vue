<template>
	<vs-table striped class="admin-menus-table">
		<template #header>
			<vs-row justify="center">
				<h3>{{ menuGroup.name }}</h3>
			</vs-row>
		</template>
		<template #thead>
			<vs-tr>
				<vs-th>이름</vs-th>
				<vs-th>가격</vs-th>
				<vs-th></vs-th>
			</vs-tr>
		</template>
		<template #tbody>
			<!-- New menu row -->
			<vs-tr>
				<vs-td>
					<vs-input class="my-input-name" v-model="newMenu.name" placeholder="이름" />
				</vs-td>
				<vs-td>
					<vs-input class="my-input-price" v-model="newMenu.price" placeholder="가격" />
				</vs-td>
				<vs-td>
					<vs-row justify="flex-end">
						<vs-button icon circle success @click="addMenu">
							<i class="bx bx-plus" />
						</vs-button>
					</vs-row>
				</vs-td>
			</vs-tr>
			<!-- Delete menuGroup row -->
			<vs-tr v-if="!menus.length">
				<vs-td>카테고리 삭제</vs-td>
				<vs-td></vs-td>
				<vs-td>
					<vs-row justify="flex-end">
						<vs-button icon circle danger @click="$emit('delete')">
							<i class="bx bxs-trash" />
						</vs-button>
					</vs-row>
				</vs-td>
			</vs-tr>
			<vs-tr v-for="menu in menus" :key="menu._id">
				<vs-td>{{ menu.name }}</vs-td>
				<vs-td>{{ menu.price }}</vs-td>
				<vs-td>
					<vs-row justify="flex-end">
						<vs-button icon circle danger @click="deleteMenu(menu._id)">
							<i class="bx bxs-trash" />
						</vs-button>
					</vs-row>
				</vs-td>
			</vs-tr>
		</template>
	</vs-table>
</template>

<script>
import axios from 'axios'

const endpoint = process.env.VUE_APP_API_ENDPOINT

export default {
	props: {
		menuGroup: {
			type: Object
		}
	},
	data: function() {
		return {
			menus: [],
			newMenu: { name: undefined, price: undefined }
		}
	},
	methods: {
		getMenus() {
			// Get the menus corresponding to the current menuGroup
			axios
				.get(endpoint + '/api/menu/by-group', { params: { groupId: this.menuGroup._id } })
				.then((res) => {
					this.newMenu.name = undefined
					this.newMenu.price = undefined
					this.menus = res.data
				})
				.catch((err) => {
					console.error(err)
					alert('메뉴 로딩중 에러가 발생했습니다.')
				})
		},
		addMenu() {
			// Check the inputs
			if (!this.newMenu.name || !parseInt(this.newMenu.price)) {
				alert('메뉴 이름과 가격을 올바르게 입력해주세요.')
			} else {
				axios
					.post(endpoint + '/api/menu', {
						name: this.newMenu.name,
						price: parseInt(this.newMenu.price),
						userId: this.$store.state.adminUser.name,
						groupId: this.menuGroup._id
					})
					.then((res) => {
						if (res.data.success) {
							this.getMenus()
						} else {
							alert('메뉴 추가에 실패했습니다.')
						}
					})
					.catch((err) => {
						console.error(err)
						alert('메뉴 저장중 에러가 발생했습니다.')
					})
			}
		},
		deleteMenu(menuId) {
			// Delete the selected menui
			axios
				.delete(endpoint + '/api/menu', { params: { menuId: menuId } })
				.then((res) => {
					if (res.data.success) {
						this.getMenus()
					} else {
						alert('메뉴 삭제에 실패했습니다.')
					}
				})
				.catch((err) => {
					console.error(err)
					alert('메뉴 삭제중 에러가 발생했습니다.')
				})
		}
	},
	created() {
		this.getMenus()
	}
}
</script>

<style scoped>
h3 {
	margin: 0.5rem 0;
}
</style>

<style>
.admin-menus-table .vs-table__header {
	background: rgba(var(--vs-gray-1), 1);
}

.admin-menus-table input {
	height: 2.5rem;
}

.my-input-name input {
	width: calc(70%);
}

.my-input-price input {
	width: 4.5rem;
}

@media (max-width: 900px) {
	.my-input-name input {
		width: 7rem;
	}

	.my-input-price input {
		width: 4rem;
	}
}

@media (max-width: 600px) {
	.my-input-name input {
		width: 8rem;
	}
}
</style>
