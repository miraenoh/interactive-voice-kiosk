<template>
	<div class="grid">
		<vs-row justify="center">
			<vs-col lg="6" sm="9" xs="11">
				<h1 class="center">
					{{ user.storeName }}
				</h1>
				<vs-row>
					<vs-col w="12">
						<div class="container">
							<vs-table v-if="user">
								<template #thead>
									<vs-tr>
										<vs-th>
											메뉴판
										</vs-th>
										<vs-th> </vs-th>
									</vs-tr>
								</template>
								<template #tbody>
									<vs-tr>
										<vs-td>메뉴를 고른 뒤 버튼을 눌러 주문하세요.</vs-td>
										<vs-td> </vs-td>
									</vs-tr>
									<vs-tr v-for="menu in menuViews" :key="menu.id" :class="menu.class">
										<vs-td>
											{{ menu.name }}
										</vs-td>
										<vs-td class="right">
											{{ menu.price }}
										</vs-td>
									</vs-tr>
								</template>
							</vs-table>
							<p v-else>존재하지 않는 가게입니다.</p>
						</div>
						<div class="bottom-intent"></div>
					</vs-col>
				</vs-row>
			</vs-col>
		</vs-row>
		<div>
			<vs-avatar class="bottomRight" circle primary size="120">
				<i class="bx bxs-bot"></i>
			</vs-avatar>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
const dummyMenus = [
	{ id: 1, name: '아메리카노', price: 3000, groupId: 1 },
	{ id: 2, name: '카페라떼', price: 4000, groupId: 1 },
	{ id: 3, name: '카페모카', price: 4000, groupId: 1 },
	{ id: 4, name: '카라멜 마끼아또', price: 4000, groupId: 1 },
	{ id: 5, name: '아이스 바닐라 라떼', price: 5000, groupId: 1 },
	{ id: 6, name: '티라미수', price: 5500, groupId: 3 },
	{ id: 7, name: '치즈 케이크', price: 5500, groupId: 3 },
	{ id: 8, name: '초코 케이크', price: 5500, groupId: 3 },
	{ id: 9, name: '브라우니', price: 5500, groupId: 3 },
	{ id: 10, name: '그린티', price: 3000, groupId: 2 },
	{ id: 11, name: '블랙티', price: 3000, groupId: 2 },
	{ id: 12, name: '자몽 허니 블랙티', price: 3000, groupId: 2 },
	{ id: 13, name: '레몬 녹차', price: 3000, groupId: 2 },
	{ id: 14, name: '복숭아 아이스티', price: 3000, groupId: 2 },
	{ id: 15, name: '레몬 아이스티', price: 3000, groupId: 2 },
	{ id: 16, name: '바리스타 티', price: 3000, groupId: 2 },
	{ id: 17, name: '캐모마일', price: 3000, groupId: 2 },
	{ id: 18, name: '페퍼민트', price: 3000, groupId: 2 },
	{ id: 19, name: '자스민티', price: 3000, groupId: 2 }
]
const dummyGroups = [
	{ id: 1, name: '커피' },
	{ id: 2, name: '음료' },
	{ id: 3, name: '디저트' }
]
export default {
	components: {},
	data: function() {
		return {
			user: {},
			menus: [],
			menuGroups: [],
			menuViews: []
		}
	},
	props: ['id'],
	async mounted() {
		const loading = this.$vs.loading()

		// Check if the user exists
		let res = await axios.get('/api/user', { params: { id: this.id } })
		this.user = res.data

		// Get all menus and menuGroups by userId
		res = await axios.get('/api/menu/by-user', { params: { userId: this.id } })
		this.menus = res.data
		res = await axios.get('/api/menu/group/by-user', { params: { userId: this.id } })
		this.menuGroups = res.data

		this.createMenuView()

		loading.close()
	},
	methods: {
		createMenuView() {
			let group, menu
			for (group of this.menuGroups) {
				group.class = 'my-header'
				this.menuViews.push(group)
				for (menu of this.menus) {
					if (menu.groupId === group._id) {
						this.menuViews.push(menu)
					}
				}
			}
		}
	}
}
</script>
<style>
body {
	background: rgba(var(--vs-gray-2), 1);
}
.container {
	background-color: white;
	border-radius: 1rem;
	padding: 1rem;
}
h1 {
	font-family: 'Jua';
	font-weight: normal;
	font-size: 3rem;
}
.vs-avatar {
	cursor: pointer;
}
.vs-avatar i {
	font-size: 3.5rem !important;
}
.my-header {
	background-color: rgba(var(--vs-gray-2), 1);
	font-weight: bold;
}
div.bottom-intent {
	height: 100px;
}
</style>
