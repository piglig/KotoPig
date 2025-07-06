import json

# --- 1. 精心准备的高频词例句 ---
CURATED_EXAMPLES = {
    "食べる": [
        {
            "japanese": "毎日、日本語を勉強します。",
            "reading": "まいにち、にほんごをべんきょうします。",
            "translation": "我每天学习日语。"
        }
    ],
    "飲む": [
        {
            "japanese": "水を飲みます。",
            "reading": "みずをのみます。",
            "translation": "喝水。"
        }
    ],
    "する": [
        {
            "japanese": "宿題をします。",
            "reading": "しゅくだいをします。",
            "translation": "做作业。"
        }
    ],
    "来る": [
        {
            "japanese": "明日、友達が来ます。",
            "reading": "あした、ともだちがきます。",
            "translation": "明天朋友要来。"
        }
    ],
    "見る": [
        {
            "japanese": "テレビを見ます。",
            "reading": "テレビをみます。",
            "translation": "看电视。"
        }
    ],
    "行く": [
        {
            "japanese": "週末、京都へ行きます。",
            "reading": "しゅうまつ、きょうとへいきます。",
            "translation": "周末去京都。"
        }
    ],
    "話す": [
        {
            "japanese": "彼は英語を上手に話します。",
            "reading": "かれはえいごをじょうずにはなします。",
            "translation": "他英语说得很好。"
        }
    ]
}

# --- 2. 内嵌的开源词库数据 (示例) ---
# 这是一个模拟的、从大型开源词库中提取的数据结构
# 包含了我们需要的所有信息
SOURCE_VERBS_DATA = [
    # 数据源: https://github.com/mifunetoshiro/kanjium (经过简化和格式调整)
    {"verb":"会う","kana":"あう","gloss":"to meet","tags":["Godan","JLPT N5"],"forms":{"dictionary":"会う","nai":"会わない","masu":"会います","te":"会って","past":"会った","potential":"会える","passive":"会われる","causative":"会わせる","imperative":"会え","volitional":"会おう","ba":"会えば"}},
    {"verb":"開く","kana":"あく","gloss":"to open","tags":["Godan","JLPT N4"],"forms":{"dictionary":"開く","nai":"開かない","masu":"開きます","te":"開いて","past":"開いた","potential":"開ける","passive":"開かれる","causative":"開かせる","imperative":"開け","volitional":"開こう","ba":"開けば"}},
    {"verb":"遊ぶ","kana":"あそぶ","gloss":"to play","tags":["Godan","JLPT N5"],"forms":{"dictionary":"遊ぶ","nai":"遊ばない","masu":"遊びます","te":"遊んで","past":"遊んだ","potential":"遊べる","passive":"遊ばれる","causative":"遊ばせる","imperative":"遊べ","volitional":"遊ぼう","ba":"遊べば"}},
    {"verb":"浴びる","kana":"あびる","gloss":"to bathe, to shower","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"浴びる","nai":"浴びない","masu":"浴びます","te":"浴びて","past":"浴びた","potential":"浴びられる","passive":"浴びられる","causative":"浴びさせる","imperative":"浴びろ","volitional":"浴びよう","ba":"浴びれば"}},
    {"verb":"洗う","kana":"あらう","gloss":"to wash","tags":["Godan","JLPT N5"],"forms":{"dictionary":"洗う","nai":"洗わない","masu":"洗います","te":"洗って","past":"洗った","potential":"洗える","passive":"洗われる","causative":"洗わせる","imperative":"洗え","volitional":"洗おう","ba":"洗えば"}},
    {"verb":"ある","kana":"ある","gloss":"to be, to exist","tags":["Godan","JLPT N5"],"forms":{"dictionary":"ある","nai":"ない","masu":"あります","te":"あって","past":"あった","potential":"- ","passive":"- ","causative":"- ","imperative":"あれ","volitional":"あろう","ba":"あれば"}},
    {"verb":"歩く","kana":"あるく","gloss":"to walk","tags":["Godan","JLPT N5"],"forms":{"dictionary":"歩く","nai":"歩かない","masu":"歩きます","te":"歩いて","past":"歩いた","potential":"歩ける","passive":"歩かれる","causative":"歩かせる","imperative":"歩け","volitional":"歩こう","ba":"歩けば"}},
    {"verb":"言う","kana":"いう","gloss":"to say","tags":["Godan","JLPT N5"],"forms":{"dictionary":"言う","nai":"言わない","masu":"言います","te":"言って","past":"言った","potential":"言える","passive":"言われる","causative":"言わせる","imperative":"言え","volitional":"言おう","ba":"言えば"}},
    {"verb":"行く","kana":"いく","gloss":"to go","tags":["Godan","JLPT N5"],"forms":{"dictionary":"行く","nai":"行かない","masu":"行きます","te":"行って","past":"行った","potential":"行ける","passive":"行かれる","causative":"行かせる","imperative":"行け","volitional":"行こう","ba":"行けば"}},
    {"verb":"要る","kana":"いる","gloss":"to need","tags":["Godan","JLPT N5"],"forms":{"dictionary":"要る","nai":"要らない","masu":"要ります","te":"要って","past":"要った","potential":"- ","passive":"- ","causative":"- ","imperative":"- ","volitional":"- ","ba":"要れば"}},
    {"verb":"入れる","kana":"いれる","gloss":"to put in","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"入れる","nai":"入れない","masu":"入れます","te":"入れて","past":"入れた","potential":"入れられる","passive":"入れられる","causative":"入れさせる","imperative":"入れろ","volitional":"入れよう","ba":"入れれば"}},
    {"verb":"歌う","kana":"うたう","gloss":"to sing","tags":["Godan","JLPT N5"],"forms":{"dictionary":"歌う","nai":"歌わない","masu":"歌います","te":"歌って","past":"歌った","potential":"歌える","passive":"歌われる","causative":"歌わせる","imperative":"歌え","volitional":"歌おう","ba":"歌えば"}},
    {"verb":"生まれる","kana":"うまれる","gloss":"to be born","tags":["Ichidan","JLPT N4"],"forms":{"dictionary":"生まれる","nai":"生まれない","masu":"生まれます","te":"生まれて","past":"生まれた","potential":"- ","passive":"- ","causative":"- ","imperative":"- ","volitional":"- ","ba":"生まれれば"}},
    {"verb":"売る","kana":"うる","gloss":"to sell","tags":["Godan","JLPT N5"],"forms":{"dictionary":"売る","nai":"売らない","masu":"売ります","te":"売って","past":"売った","potential":"売れる","passive":"売られる","causative":"売らせる","imperative":"売れ","volitional":"売ろう","ba":"売れば"}},
    {"verb":"起きる","kana":"おきる","gloss":"to get up","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"起きる","nai":"起きない","masu":"起きます","te":"起きて","past":"起きた","potential":"起きられる","passive":"起きられる","causative":"起きさせる","imperative":"起きろ","volitional":"起きよう","ba":"起きれば"}},
    {"verb":"置く","kana":"おく","gloss":"to put","tags":["Godan","JLPT N5"],"forms":{"dictionary":"置く","nai":"置かない","masu":"置きます","te":"置いて","past":"置いた","potential":"置ける","passive":"置かれる","causative":"置かせる","imperative":"置け","volitional":"置こう","ba":"置けば"}},
    {"verb":"教える","kana":"おしえる","gloss":"to teach","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"教える","nai":"教えない","masu":"教えます","te":"教えて","past":"教えた","potential":"教えられる","passive":"教えられる","causative":"教えさせる","imperative":"教えろ","volitional":"教えよう","ba":"教えれば"}},
    {"verb":"押す","kana":"おす","gloss":"to push","tags":["Godan","JLPT N5"],"forms":{"dictionary":"押す","nai":"押さない","masu":"押します","te":"押して","past":"押した","potential":"押せる","passive":"押される","causative":"押させる","imperative":"押せ","volitional":"押そう","ba":"押せば"}},
    {"verb":"覚える","kana":"おぼえる","gloss":"to remember","tags":["Ichidan","JLPT N4"],"forms":{"dictionary":"覚える","nai":"覚えない","masu":"覚えます","te":"覚えて","past":"覚えた","potential":"覚えられる","passive":"覚えられる","causative":"覚えさせる","imperative":"覚えろ","volitional":"覚えよう","ba":"覚えれば"}},
    {"verb":"泳ぐ","kana":"およぐ","gloss":"to swim","tags":["Godan","JLPT N5"],"forms":{"dictionary":"泳ぐ","nai":"泳がない","masu":"泳ぎます","te":"泳いで","past":"泳いだ","potential":"泳げる","passive":"泳がれる","causative":"泳がせる","imperative":"泳げ","volitional":"泳ごう","ba":"泳げば"}},
    {"verb":"降りる","kana":"おりる","gloss":"to get off","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"降りる","nai":"降りない","masu":"降ります","te":"降りて","past":"降りた","potential":"降りられる","passive":"降りられる","causative":"降りさせる","imperative":"降りろ","volitional":"降りよう","ba":"降りれば"}},
    {"verb":"終わる","kana":"おわる","gloss":"to end","tags":["Godan","JLPT N5"],"forms":{"dictionary":"終わる","nai":"終わらない","masu":"終わります","te":"終わって","past":"終わった","potential":"- ","passive":"- ","causative":"- ","imperative":"- ","volitional":"- ","ba":"終われば"}},
    {"verb":"買う","kana":"かう","gloss":"to buy","tags":["Godan","JLPT N5"],"forms":{"dictionary":"買う","nai":"買わない","masu":"買います","te":"買って","past":"買った","potential":"買える","passive":"買われる","causative":"買わせる","imperative":"買え","volitional":"買おう","ba":"買えば"}},
    {"verb":"返す","kana":"かえす","gloss":"to return (something)","tags":["Godan","JLPT N5"],"forms":{"dictionary":"返す","nai":"返さない","masu":"返します","te":"返して","past":"返した","potential":"返せる","passive":"返される","causative":"返させる","imperative":"返せ","volitional":"返そう","ba":"返せば"}},
    {"verb":"帰る","kana":"かえる","gloss":"to go home","tags":["Godan","JLPT N5"],"forms":{"dictionary":"帰る","nai":"帰らない","masu":"帰ります","te":"帰って","past":"帰った","potential":"帰れる","passive":"帰られる","causative":"帰らせる","imperative":"帰れ","volitional":"帰ろう","ba":"帰れば"}},
    {"verb":"書く","kana":"かく","gloss":"to write","tags":["Godan","JLPT N5"],"forms":{"dictionary":"書く","nai":"書かない","masu":"書きます","te":"書いて","past":"書いた","potential":"書ける","passive":"書かれる","causative":"書かせる","imperative":"書け","volitional":"書こう","ba":"書けば"}},
    {"verb":"かける","kana":"かける","gloss":"to call (by phone)","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"かける","nai":"かけない","masu":"かけます","te":"かけて","past":"かけた","potential":"かけられる","passive":"かけられる","causative":"かけさせる","imperative":"かけろ","volitional":"かけよう","ba":"かければ"}},
    {"verb":"貸す","kana":"かす","gloss":"to lend","tags":["Godan","JLPT N5"],"forms":{"dictionary":"貸す","nai":"貸さない","masu":"貸します","te":"貸して","past":"貸した","potential":"貸せる","passive":"貸される","causative":"貸させる","imperative":"貸せ","volitional":"貸そう","ba":"貸せば"}},
    {"verb":"借りる","kana":"かりる","gloss":"to borrow","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"借りる","nai":"借りない","masu":"借ります","te":"借りて","past":"借りた","potential":"借りられる","passive":"借りられる","causative":"借りさせる","imperative":"借りろ","volitional":"借りよう","ba":"借りれば"}},
    {"verb":"消える","kana":"きえる","gloss":"to disappear","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"消える","nai":"消えない","masu":"消えます","te":"消えて","past":"消えた","potential":"- ","passive":"- ","causative":"- ","imperative":"- ","volitional":"- ","ba":"消えれば"}},
    {"verb":"聞く","kana":"きく","gloss":"to listen, to ask","tags":["Godan","JLPT N5"],"forms":{"dictionary":"聞く","nai":"聞かない","masu":"聞きます","te":"聞いて","past":"聞いた","potential":"聞ける","passive":"聞かれる","causative":"聞かせる","imperative":"聞け","volitional":"聞こう","ba":"聞けば"}},
    {"verb":"切る","kana":"きる","gloss":"to cut","tags":["Godan","JLPT N5"],"forms":{"dictionary":"切る","nai":"切らない","masu":"切ります","te":"切って","past":"切った","potential":"切れる","passive":"切られる","causative":"切らせる","imperative":"切れ","volitional":"切ろう","ba":"切れば"}},
    {"verb":"着る","kana":"きる","gloss":"to wear","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"着る","nai":"着ない","masu":"着ます","te":"着て","past":"着た","potential":"着られる","passive":"着られる","causative":"着させる","imperative":"着ろ","volitional":"着よう","ba":"着れば"}},
    {"verb":"来る","kana":"くる","gloss":"to come","tags":["Kuru","JLPT N5"],"forms":{"dictionary":"来る","nai":"来ない","masu":"来ます","te":"来て","past":"来た","potential":"来られる","passive":"来られる","causative":"来させる","imperative":"来い","volitional":"来よう","ba":"来れば"}},
    {"verb":"消す","kana":"けす","gloss":"to turn off, to erase","tags":["Godan","JLPT N5"],"forms":{"dictionary":"消す","nai":"消さない","masu":"消します","te":"消して","past":"消した","potential":"消せる","passive":"消される","causative":"消させる","imperative":"消せ","volitional":"消そう","ba":"消せば"}},
    {"verb":"答える","kana":"こたえる","gloss":"to answer","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"答える","nai":"答えない","masu":"答えます","te":"答えて","past":"答えた","potential":"答えられる","passive":"答えられる","causative":"答えさせる","imperative":"答えろ","volitional":"答えよう","ba":"答えれば"}},
    {"verb":"知る","kana":"しる","gloss":"to know","tags":["Godan","JLPT N5"],"forms":{"dictionary":"知る","nai":"知らない","masu":"知ります","te":"知って","past":"知った","potential":"知れる","passive":"知られる","causative":"知らせる","imperative":"知れ","volitional":"知ろう","ba":"知れば"}},
    {"verb":"する","kana":"する","gloss":"to do","tags":["Suru","JLPT N5"],"forms":{"dictionary":"する","nai":"しない","masu":"します","te":"して","past":"した","potential":"できる","passive":"される","causative":"させる","imperative":"しろ","volitional":"しよう","ba":"すれば"}},
    {"verb":"住む","kana":"すむ","gloss":"to live (in a place)","tags":["Godan","JLPT N5"],"forms":{"dictionary":"住む","nai":"住まない","masu":"住みます","te":"住んで","past":"住んだ","potential":"住める","passive":"住まれる","causative":"住ませる","imperative":"住め","volitional":"住もう","ba":"住めば"}},
    {"verb":"座る","kana":"すわる","gloss":"to sit","tags":["Godan","JLPT N5"],"forms":{"dictionary":"座る","nai":"座らない","masu":"座ります","te":"座って","past":"座った","potential":"座れる","passive":"座られる","causative":"座らせる","imperative":"座れ","volitional":"座ろう","ba":"座れば"}},
    {"verb":"出す","kana":"だす","gloss":"to take out, to submit","tags":["Godan","JLPT N5"],"forms":{"dictionary":"出す","nai":"出さない","masu":"出します","te":"出して","past":"出した","potential":"出せる","passive":"出される","causative":"出させる","imperative":"出せ","volitional":"出そう","ba":"出せば"}},
    {"verb":"立つ","kana":"たつ","gloss":"to stand","tags":["Godan","JLPT N5"],"forms":{"dictionary":"立つ","nai":"立たない","masu":"立ちます","te":"立って","past":"立った","potential":"立てる","passive":"立たれる","causative":"立たせる","imperative":"立て","volitional":"立とう","ba":"立てば"}},
    {"verb":"食べる","kana":"たべる","gloss":"to eat","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"食べる","nai":"食べない","masu":"食べます","te":"食べて","past":"食べた","potential":"食べられる","passive":"食べられる","causative":"食べさせる","imperative":"食べろ","volitional":"食べよう","ba":"食べれば"}},
    {"verb":"違う","kana":"ちがう","gloss":"to be different","tags":["Godan","JLPT N5"],"forms":{"dictionary":"違う","nai":"違わない","masu":"違います","te":"違って","past":"違った","potential":"- ","passive":"- ","causative":"- ","imperative":"- ","volitional":"- ","ba":"違えば"}},
    {"verb":"使う","kana":"つかう","gloss":"to use","tags":["Godan","JLPT N5"],"forms":{"dictionary":"使う","nai":"使わない","masu":"使います","te":"使って","past":"使った","potential":"使える","passive":"使われる","causative":"使わせる","imperative":"使え","volitional":"使おう","ba":"使えば"}},
    {"verb":"疲れる","kana":"つかれる","gloss":"to get tired","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"疲れる","nai":"疲れない","masu":"疲れます","te":"疲れて","past":"疲れた","potential":"- ","passive":"- ","causative":"- ","imperative":"- ","volitional":"- ","ba":"疲れれば"}},
    {"verb":"着く","kana":"つく","gloss":"to arrive","tags":["Godan","JLPT N5"],"forms":{"dictionary":"着く","nai":"着かない","masu":"着きます","te":"着いて","past":"着いた","potential":"着ける","passive":"着かれる","causative":"着かせる","imperative":"着け","volitional":"着こう","ba":"着けば"}},
    {"verb":"作る","kana":"つくる","gloss":"to make","tags":["Godan","JLPT N5"],"forms":{"dictionary":"作る","nai":"作らない","masu":"作ります","te":"作って","past":"作った","potential":"作れる","passive":"作られる","causative":"作らせる","imperative":"作れ","volitional":"作ろう","ba":"作れば"}},
    {"verb":"出る","kana":"でる","gloss":"to go out, to leave","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"出る","nai":"出ない","masu":"出ます","te":"出て","past":"出た","potential":"出られる","passive":"出られる","causative":"出させる","imperative":"出ろ","volitional":"出よう","ba":"出れば"}},
    {"verb":"飛ぶ","kana":"とぶ","gloss":"to fly","tags":["Godan","JLPT N5"],"forms":{"dictionary":"飛ぶ","nai":"飛ばない","masu":"飛びます","te":"飛んで","past":"飛んだ","potential":"飛べる","passive":"飛ばれる","causative":"飛ばせる","imperative":"飛べ","volitional":"飛ぼう","ba":"飛べば"}},
    {"verb":"止まる","kana":"とまる","gloss":"to stop","tags":["Godan","JLPT N5"],"forms":{"dictionary":"止まる","nai":"止まらない","masu":"止まります","te":"止まって","past":"止まった","potential":"- ","passive":"- ","causative":"- ","imperative":"- ","volitional":"- ","ba":"止まれば"}},
    {"verb":"取る","kana":"とる","gloss":"to take","tags":["Godan","JLPT N5"],"forms":{"dictionary":"取る","nai":"取らない","masu":"取ります","te":"取って","past":"取った","potential":"取れる","passive":"取られる","causative":"取らせる","imperative":"取れ","volitional":"取ろう","ba":"取れば"}},
    {"verb":"直す","kana":"なおす","gloss":"to fix, to repair","tags":["Godan","JLPT N4"],"forms":{"dictionary":"直す","nai":"直さない","masu":"直します","te":"直して","past":"直した","potential":"直せる","passive":"直される","causative":"直させる","imperative":"直せ","volitional":"直そう","ba":"直せば"}},
    {"verb":"泣く","kana":"なく","gloss":"to cry","tags":["Godan","JLPT N5"],"forms":{"dictionary":"泣く","nai":"泣かない","masu":"泣きます","te":"泣いて","past":"泣いた","potential":"泣ける","passive":"泣かれる","causative":"泣かせる","imperative":"泣け","volitional":"泣こう","ba":"泣けば"}},
    {"verb":"並ぶ","kana":"ならぶ","gloss":"to line up","tags":["Godan","JLPT N5"],"forms":{"dictionary":"並ぶ","nai":"並ばない","masu":"並びます","te":"並んで","past":"並んだ","potential":"- ","passive":"- ","causative":"- ","imperative":"- ","volitional":"- ","ba":"並べば"}},
    {"verb":"なる","kana":"なる","gloss":"to become","tags":["Godan","JLPT N5"],"forms":{"dictionary":"なる","nai":"ならない","masu":"なります","te":"なって","past":"なった","potential":"なれる","passive":"なられる","causative":"ならせる","imperative":"なれ","volitional":"なろう","ba":"なれば"}},
    {"verb":"寝る","kana":"ねる","gloss":"to sleep","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"寝る","nai":"寝ない","masu":"寝ます","te":"寝て","past":"寝た","potential":"寝られる","passive":"寝られる","causative":"寝させる","imperative":"寝ろ","volitional":"寝よう","ba":"寝れば"}},
    {"verb":"登る","kana":"のぼる","gloss":"to climb","tags":["Godan","JLPT N5"],"forms":{"dictionary":"登る","nai":"登らない","masu":"登ります","te":"登って","past":"登った","potential":"登れる","passive":"登られる","causative":"登らせる","imperative":"登れ","volitional":"登ろう","ba":"登れば"}},
    {"verb":"飲む","kana":"のむ","gloss":"to drink","tags":["Godan","JLPT N5"],"forms":{"dictionary":"飲む","nai":"飲まない","masu":"飲みます","te":"飲んで","past":"飲んだ","potential":"飲める","passive":"飲まれる","causative":"飲ませる","imperative":"飲め","volitional":"飲もう","ba":"飲めば"}},
    {"verb":"乗る","kana":"のる","gloss":"to ride","tags":["Godan","JLPT N5"],"forms":{"dictionary":"乗る","nai":"乗らない","masu":"乗ります","te":"乗って","past":"乗った","potential":"乗れる","passive":"乗られる","causative":"乗らせる","imperative":"乗れ","volitional":"乗ろう","ba":"乗れば"}},
    {"verb":"入る","kana":"はいる","gloss":"to enter","tags":["Godan","JLPT N5"],"forms":{"dictionary":"入る","nai":"入らない","masu":"入ります","te":"入って","past":"入った","potential":"入れる","passive":"入られる","causative":"入らせる","imperative":"入れ","volitional":"入ろう","ba":"入れば"}},
    {"verb":"始まる","kana":"はじまる","gloss":"to begin","tags":["Godan","JLPT N5"],"forms":{"dictionary":"始まる","nai":"始まらない","masu":"始まります","te":"始まって","past":"始まった","potential":"- ","passive":"- ","causative":"- ","imperative":"- ","volitional":"- ","ba":"始まれば"}},
    {"verb":"働く","kana":"はたらく","gloss":"to work","tags":["Godan","JLPT N5"],"forms":{"dictionary":"働く","nai":"働かない","masu":"働きます","te":"働いて","past":"働いた","potential":"働ける","passive":"働かれる","causative":"働かせる","imperative":"働け","volitional":"働こう","ba":"働けば"}},
    {"verb":"話す","kana":"はなす","gloss":"to speak","tags":["Godan","JLPT N5"],"forms":{"dictionary":"話す","nai":"話さない","masu":"話します","te":"話して","past":"話した","potential":"話せる","passive":"話される","causative":"話させる","imperative":"話せ","volitional":"話そう","ba":"話せば"}},
    {"verb":"引く","kana":"ひく","gloss":"to pull","tags":["Godan","JLPT N5"],"forms":{"dictionary":"引く","nai":"引かない","masu":"引きます","te":"引いて","past":"引いた","potential":"引ける","passive":"引かれる","causative":"引かせる","imperative":"引け","volitional":"引こう","ba":"引けば"}},
    {"verb":"弾く","kana":"ひく","gloss":"to play (a string instrument)","tags":["Godan","JLPT N5"],"forms":{"dictionary":"弾く","nai":"弾かない","masu":"弾きます","te":"弾いて","past":"弾いた","potential":"弾ける","passive":"弾かれる","causative":"弾かせる","imperative":"弾け","volitional":"弾こう","ba":"弾けば"}},
    {"verb":"降る","kana":"ふる","gloss":"to fall (rain, snow)","tags":["Godan","JLPT N5"],"forms":{"dictionary":"降る","nai":"降らない","masu":"降ります","te":"降って","past":"降った","potential":"- ","passive":"- ","causative":"- ","imperative":"- ","volitional":"- ","ba":"降れば"}},
    {"verb":"待つ","kana":"まつ","gloss":"to wait","tags":["Godan","JLPT N5"],"forms":{"dictionary":"待つ","nai":"待たない","masu":"待ちます","te":"待って","past":"待った","potential":"待てる","passive":"待たれる","causative":"待たせる","imperative":"待て","volitional":"待とう","ba":"待てば"}},
    {"verb":"磨く","kana":"みがく","gloss":"to brush (teeth), to polish","tags":["Godan","JLPT N5"],"forms":{"dictionary":"磨く","nai":"磨かない","masu":"磨きます","te":"磨いて","past":"磨いた","potential":"磨ける","passive":"磨かれる","causative":"磨かせる","imperative":"磨け","volitional":"磨こう","ba":"磨けば"}},
    {"verb":"見る","kana":"みる","gloss":"to see","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"見る","nai":"見ない","masu":"見ます","te":"見て","past":"見た","potential":"見られる","passive":"見られる","causative":"見させる","imperative":"見ろ","volitional":"見よう","ba":"見れば"}},
    {"verb":"見せる","kana":"みせる","gloss":"to show","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"見せる","nai":"見せない","masu":"見せます","te":"見せて","past":"見せた","potential":"見せられる","passive":"見せられる","causative":"見せさせる","imperative":"見せろ","volitional":"見せよう","ba":"見せれば"}},
    {"verb":"持つ","kana":"もつ","gloss":"to hold","tags":["Godan","JLPT N5"],"forms":{"dictionary":"持つ","nai":"持たない","masu":"持ちます","te":"持って","past":"持った","potential":"持てる","passive":"持たれる","causative":"持たせる","imperative":"持て","volitional":"持とう","ba":"持てば"}},
    {"verb":"休む","kana":"やすむ","gloss":"to rest","tags":["Godan","JLPT N5"],"forms":{"dictionary":"休む","nai":"休まない","masu":"休みます","te":"休んで","past":"休んだ","potential":"休める","passive":"休まれる","causative":"休ませる","imperative":"休め","volitional":"休もう","ba":"休めば"}},
    {"verb":"呼ぶ","kana":"よぶ","gloss":"to call out","tags":["Godan","JLPT N5"],"forms":{"dictionary":"呼ぶ","nai":"呼ばない","masu":"呼びます","te":"呼んで","past":"呼んだ","potential":"呼べる","passive":"呼ばれる","causative":"呼ばせる","imperative":"呼べ","volitional":"呼ぼう","ba":"呼べば"}},
    {"verb":"読む","kana":"よむ","gloss":"to read","tags":["Godan","JLPT N5"],"forms":{"dictionary":"読む","nai":"読まない","masu":"読みます","te":"読んで","past":"読んだ","potential":"読める","passive":"読まれる","causative":"読ませる","imperative":"読め","volitional":"読もう","ba":"読めば"}},
    {"verb":"分かる","kana":"わかる","gloss":"to understand","tags":["Godan","JLPT N5"],"forms":{"dictionary":"分かる","nai":"分からない","masu":"分かります","te":"分かって","past":"分かった","potential":"- ","passive":"- ","causative":"- ","imperative":"- ","volitional":"- ","ba":"分かれば"}},
    {"verb":"忘れる","kana":"わすれる","gloss":"to forget","tags":["Ichidan","JLPT N5"],"forms":{"dictionary":"忘れる","nai":"忘れない","masu":"忘れます","te":"忘れて","past":"忘れた","potential":"忘れられる","passive":"忘れられる","causative":"忘れさせる","imperative":"忘れろ","volitional":"忘れよう","ba":"忘れれば"}}
]

# --- 3. 转换逻辑 ---

def convert_verb_data(source_verb):
    # 从tags中解析jlpt_level和group
    jlpt_level = "Unknown"
    group = "Unknown"
    for tag in source_verb["tags"]:
        if "JLPT" in tag:
            jlpt_level = tag.replace("JLPT ", "").strip()
        if "Ichidan" in tag:
            group = "ichidan"
        elif "Godan" in tag:
            group = "godan"
        elif "Suru" in tag:
            group = "suru"
        elif "Kuru" in tag:
            group = "kuru"

    # 转换forms的key
    forms = {f"{k.lower().replace('-', '_')}_form": v for k, v in source_verb["forms"].items() if v != "- "}

    # 构建我们应用所需的数据结构
    converted_data = {
        "verb": source_verb["verb"],
        "reading": source_verb["kana"],
        "meaning": source_verb["gloss"],
        "jlpt_level": jlpt_level,
        "group": group,
        "forms": forms,
        "examples": CURATED_EXAMPLES.get(source_verb["verb"], []) # 注入例句
    }
    return converted_data

def main():
    print("--- Starting Verb Data Conversion ---")
    
    all_converted_verbs = []
    for verb_data in SOURCE_VERBS_DATA:
        converted_verb = convert_verb_data(verb_data)
        all_converted_verbs.append(converted_verb)
        
    # 将我们手动添加的、但可能不在源数据中的动词也加进去
    # (这一步确保我们的高质量例句动词一定在最终文件里)
    existing_verbs = {v['verb'] for v in all_converted_verbs}
    initial_verbs_to_add = [
        {"verb": "食べる", "reading": "たべる", "meaning": "吃", "jlpt_level": "N5", "group": "ichidan"},
        {"verb": "飲む", "reading": "のむ", "meaning": "喝", "jlpt_level": "N5", "group": "godan"},
        {"verb": "する", "reading": "する", "meaning": "做", "jlpt_level": "N5", "group": "suru"},
        {"verb": "来る", "reading": "くる", "meaning": "来", "jlpt_level": "N5", "group": "kuru"},
        {"verb": "見る", "reading": "みる", "meaning": "看", "jlpt_level": "N5", "group": "ichidan"}
    ]
    for iv in initial_verbs_to_add:
        if iv['verb'] not in existing_verbs:
            # 这是一个简化的添加，实际应用中需要完整的forms
            iv['examples'] = CURATED_EXAMPLES.get(iv['verb'], [])
            all_converted_verbs.append(iv)

    output_filename = 'verbs_full.json'
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(all_converted_verbs, f, ensure_ascii=False, indent=2)

    print(f"\n--- All Done! ---")
    print(f"Successfully converted and saved {len(all_converted_verbs)} verbs.")
    print(f"Data saved to {output_filename}")

if __name__ == '__main__':
    main()
