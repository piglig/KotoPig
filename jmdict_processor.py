import json
import re
import ijson
from japanese_verb_conjugator_v2 import JapaneseVerbFormGenerator

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
    ]
}

# --- 2. 活用逻辑 ---

def conjugate_verb(verb, verb_group):
    conjugator = JapaneseVerbFormGenerator()
    try:
        conjugations = conjugator.conjugate(verb, verb_group)
        forms = {key: value for tense in conjugations.values() for key, value in tense.items()}
        return forms
    except Exception as e:
        return {}

def conjugate_adjective(adjective, adj_type):
    forms = {"dictionary_form": adjective}
    if adj_type == "i-adjective":
        if adjective.endswith("い"):
            stem = adjective[:-1]
            forms["negative"] = stem + "くない"
            forms["past"] = stem + "かった"
            forms["past_negative"] = stem + "くなかった"
            forms["te_form"] = stem + "くて"
            forms["conditional_ba"] = stem + "ければ"
            forms["volitional"] = stem + "かろう"
        elif adjective == "いい": # Special case for いい
            forms["negative"] = "よくない"
            forms["past"] = "よかった"
            forms["past_negative"] = "よくなかった"
            forms["te_form"] = "よくて"
            forms["conditional_ba"] = "よければ"
            forms["volitional"] = "よかろう"
    elif adj_type == "na-adjective":
        forms["plain_form"] = adjective + "だ"
        forms["negative"] = adjective + "ではない"
        forms["past"] = adjective + "だった"
        forms["past_negative"] = adjective + "ではなかった"
        forms["te_form"] = adjective + "で"
        forms["conditional_ba"] = adjective + "ならば"
    return forms

# --- 3. JMdict 解析和数据转换 (针对 jmdict-eng-*.json 结构) ---

def get_word_type_and_group_from_pos(pos_tags):
    # 动词
    if "vk" in pos_tags: return "verb", "kuru" # カ变动词
    if "vs-i" in pos_tags or "vs" in pos_tags: return "verb", "suru" # サ变动词
    if "v1" in pos_tags: return "verb", "ichidan" # 一段动词
    for tag in pos_tags:
        if tag.startswith("v5"): return "verb", "godan" # 五段动词

    # 形容词
    if "adj-i" in pos_tags: return "adjective", "i-adjective" # い形容詞
    if "adj-na" in pos_tags: return "adjective", "na-adjective" # な形容詞

    # 名词
    if "n" in pos_tags: return "noun", ""

    return "unknown", ""

# 定义常见度优先级
COMMONNESS_PRIORITY = {
    "ichi": 0, # 最常见
    "news1": 1,
    "news2": 2,
    "gai1": 3,
    "spec1": 4,
    "spec2": 5,
    "spec3": 6,
    "spec4": 7,
    "spec5": 8,
    "spec6": 9,
    "spec7": 10,
    "spec8": 11,
    "spec9": 12,
    "spec10": 13,
    "nf01": 14, # Common word (frequency band)
    "nf02": 15,
    "nf03": 16,
    "nf04": 17,
    "nf05": 18,
    "nf06": 19,
    "nf07": 20,
    "nf08": 21,
    "nf09": 22,
    "nf10": 23,
    "nf11": 24,
    "nf12": 25,
    "nf13": 26,
    "nf14": 27,
    "nf15": 28,
    "nf16": 29,
    "nf17": 30,
    "nf18": 31,
    "nf19": 32,
    "nf20": 33,
    "P": 34, # Common word (general)
    "U": 35, # Unclassified (least common)
}

def get_commonness_score(misc_tags):
    score = 1000 # Default to a high score (less common)
    for tag in misc_tags:
        if tag in COMMONNESS_PRIORITY:
            score = min(score, COMMONNESS_PRIORITY[tag])
    return score

def main():
    input_filename = 'jmdict-eng-3.6.1.json' # 明确指定输入文件
    output_filename = 'public/words.json' # 更改输出文件名
    
    processed_words = []

    print(f"--- Loading and processing {input_filename} (Streaming) ---")
    try:
        with open(input_filename, 'rb') as f:
            entries = ijson.items(f, 'words.item')
            for entry in entries:
                word_type, group = "unknown", ""
                pos_tags_for_entry = []

                if "sense" in entry:
                    for sense in entry["sense"]:
                        if "partOfSpeech" in sense:
                            for pos in sense["partOfSpeech"]:
                                pos_tags_for_entry.append(pos)
                                word_type, group = get_word_type_and_group_from_pos(pos_tags_for_entry)
                                if word_type != "unknown":
                                    break
                        if word_type != "unknown":
                            break
                if word_type == "unknown":
                    continue

                # 提取词汇的汉字形式和假名形式
                word_dict_form = ""
                word_reading = ""

                # 优先使用 kanji 字段作为辞书形
                if "kanji" in entry and len(entry["kanji"]) > 0:
                    word_dict_form = entry["kanji"][0]["text"]
                
                # 使用 kana 字段作为读音
                if "kana" in entry and len(entry["kana"]) > 0:
                    word_reading = entry["kana"][0]["text"]
                
                # 如果没有汉字形式，使用假名形式作为辞书形
                if not word_dict_form and word_reading:
                    word_dict_form = word_reading
                elif not word_dict_form and not word_reading:
                    continue # 无法获取词汇形式，跳过

                # 确保有假名读音用于活用
                if not word_reading:
                    word_reading = word_dict_form # Fallback if no specific kana reading

                # 提取释义
                meaning = ""
                if "sense" in entry and len(entry["sense"]) > 0 and "gloss" in entry["sense"][0]:
                    meaning = "; ".join([g["text"] for g in entry["sense"][0]["gloss"]])

                forms = {}
                if word_type == "verb":
                    forms = conjugate_verb(word_dict_form, group)
                elif word_type == "adjective":
                    forms = conjugate_adjective(word_dict_form, group) # 形容词活用

                # 获取常见度分数
                commonness_score = get_commonness_score(entry.get("misc", []))

                # 构建最终数据结构
                final_word_data = {
                    "word": word_dict_form,
                    "reading": word_reading,
                    "meaning": meaning,
                    "type": word_type,
                    "group": group, # 仅对动词和形容词有效
                    "forms": forms,
                    "examples": CURATED_EXAMPLES.get(word_dict_form, []),
                    "commonness_score": commonness_score # 添加常见度分数
                }
                processed_words.append(final_word_data)

    except FileNotFoundError:
        print(f"Error: {input_filename} not found. Please ensure it's in the same directory as the script.")
        return
    except ijson.JSONError as e:
        print(f"Error decoding JSON from {input_filename}: {e}")
        return

    print(f"Successfully processed {len(processed_words)} words.")

    # 根据常见度分数排序
    processed_words.sort(key=lambda x: x['commonness_score'])

    # Truncate to 8000 words
    final_words = processed_words[:8000]

    print(f"--- Saving data to {output_filename} ---")
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(final_words, f, ensure_ascii=False, indent=2)
    print("--- All Done! ---")

if __name__ == '__main__':
    main()