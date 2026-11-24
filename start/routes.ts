import router from '@adonisjs/core/services/router'

const HomeController = () => import('#controllers/home_controller')
const MessagesController = () => import('#controllers/messages_controller')
const CommentsController = () => import('#controllers/comments_controller')

router.get('/', [HomeController, 'index'])
router.post('/messages', [MessagesController, 'store'])
router.post('/comments', [CommentsController, 'store'])
