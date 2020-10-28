const { Menu } = require('../models/Menu')
const { MenuGroup } = require('../models/MenuGroup')

const makeVoice = require('./conversationService').makeVoice

const updateExplanation = async (user) => {
	try {
		const fileName = 'explain-menus-' + user.name
        const transcript = await createTranscript(user)

		await makeVoice(fileName, transcript)

		return true
	} catch (err) {
		console.error(err)
		return false
	}
}

const createTranscript = async (user) => {
	try {
		let transcript = `${user.storeName}의 메뉴를 설명해드릴게요. `

		// Get all menuGroups corresponding to the user
		const menuGroups = await MenuGroup.find({ userId: user.name }).exec()
		if (!menuGroups.length) {
			transcript += `등록된 메뉴가 없습니다.`
		}

		for (const i_menuGroup in menuGroups) {
			if (i_menuGroup == 0) {
				transcript += `먼저, `
			} else {
				transcript += `다음은 `
			}
			transcript += `${menuGroups[i_menuGroup].name} 카테고리입니다. `

			const menus = await Menu.find({ groupId: menuGroups[i_menuGroup]._id }).exec()
			if (!menus.length) {
				transcript += `이 카테고리에는 메뉴가 없습니다. `
			}

			for (const menu of menus) {
				transcript += `${menu.name} ${menu.price}원. `
			}
		}

		transcript += `${user.storeName} 메뉴설명이었습니다.`

		return transcript
	} catch (err) {
		throw err
	}
}

module.exports = {
	updateExplanation: updateExplanation
}
