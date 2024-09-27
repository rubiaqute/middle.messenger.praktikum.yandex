import { IChatItem } from "./pages";
import { ProfileData } from "./pages/profile/utils";

export const profileData: ProfileData = {
    email: 'pochta@test.ru',
    login: 'ivanivanov',
    firstName: 'Иван',
    secondName: 'Петров',
    phone: '+79099673030',
    displayName: 'Ваня',
    password: 'very_good_Password7'
}

export const chatList: IChatItem[] = [
    {
        id: 1,
        chatName: 'Вадим',
        unreadCount: 2,
        messages: [
            {
                isSelf: true,
                time: '2024-09-27 18:00:00',
                text: `Во глубине сибирских руд
                Храните гордое терпенье,Не пропадет ваш скорбный труд
                И дум высокое стремленье.`
            },
            {
                isSelf: false,
                time: '2024-09-27 18:23:00',
                text: `Не пропадет ваш скорбный труд
                И дум высокое стремленье.`
            }
        ]
    },
    {
        id: 2,
        chatName: 'Даша',
        unreadCount: 0,
        messages: [
            {
                isSelf: false,
                time: '2024-09-26 18:00:00',
                text: `Несчастью верная сестра,
                Надежда в мрачном подземелье`
            },
        ]
    },
    {
        id: 3,
        chatName: 'Артем',
        unreadCount: 0,
        messages: [
            {
                isSelf: true,
                time: '2024-09-25 18:00:00',
                text: `Разбудит бодрость и веселье,
                Придет желанная пора:`
            },
        ]
    },
    {
        id: 4,
        chatName: '1,2,3',
        unreadCount: 1,
        messages: [
            {
                isSelf: true,
                time: '2024-09-25 17:00:00',
                text: `Любовь и дружество до вас
                Дойдут сквозь мрачные затворы,`
            },
        ]
    },
    {
        id: 5,
        chatName: 'Слава',
        unreadCount: 1,
        messages: [
            {
                isSelf: false,
                time: '2024-09-24 18:00:00',
                text: `Как в ваши каторжные норы
                Доходит мой свободный глас.`
            },
        ]
    },
    {
        id: 6,
        chatName: 'Магазин',
        unreadCount: 0,
        messages: [
            {
                isSelf: false,
                time: '2024-09-23 18:00:00',
                text: `Оковы тяжкие падут,
                Темницы рухнут — и свобода`
            },
        ]
    },
    {
        id: 7,
        chatName: 'Киноклуб',
        unreadCount: 0,
        messages: [
            {
                isSelf: true,
                time: '2024-09-22 18:00:00',
                text: `Вас примет радостно у входа,
                И братья меч вам отдадут.`
            },
        ]
    },
]
