'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'it' | 'en' | 'es' | 'fr' | 'de' | 'ru' | 'ja' | 'zh' | 'ko' | 'hi';
type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  'La Nuova Era dell\'%ndustria Musicale': { 
    it: 'La Nuova Era dell\'Industria Musicale', 
    en: 'The New Era of the Music Industry',
    es: 'La Nueva Era de la Industria Musical',
    fr: 'La Nouvelle ère de l\'Industrie Muscale',
    de: 'Die neue Ära der Musikindustrie',
    ru: 'Новая эра музыкальной индустрии',
    ja: '音楽産業の新時代',
    zh: '音乐产业的新纪元',
    ko: '음악 산엄의 새Ρ� 시대�,
    hi: 'सुगीत उत्योध का नयी युग'
  },
  'Accesso Anticipato Chiuso': { 
    it: 'Accesso Anticipato Chiuso', 
    en: 'Early Access Closed',
    es: 'Acceso Anticipado Cerrado',
    fr: 'Accès Anticipé Fermé',
    de: 'Vorabzugang Geschlossen',
    ru: 'Ранний доступ закрыт',
    ja: '��期アクセス終了',
    zh: '抢先体验巳关闭',
    ko: '사전 참여 종료',
    hi: 'पारंभिक पटुँच बंढ'
  },
  'Benvenuto a Bordo!': { 
    it: 'Benvenuto a Bordo!', 
    en: 'Welcome Aboard!',
    es: '±Bienvenido a Bordo!',
    fr: 'Bienvenue è Bord !',
    de: 'Willkommen an Bord!',
    ru: 'Добро пожаловать на борт!',
    ja: 'かうこそ！',
    zh: '欢迎加入！',
    ko: '활영함니다!',
    hi: 'स्वागत ह࣌!'
  },
  'Questa email è già in lista d'attesa!': { 
    it: 'Questa email è già in lista d'attesa!', 
    en: 'This email is already on the waitlist!',
    es: '¢Este correo ya está en la lista de espera!',
    fr: 'Cet e-mail est déjà sur la liste d''attente !',
    de: 'Diese E-Mail steht bereits auf der Warteliste!',
    ru: 'Этот email уже в списке ожидания!',
    ja: 'このメールアドレスは�x�に順番待ちリストに登録されています！',
    zh: '此邮箱已在候补名单中！',
    ko: '이 이메일은 이미 대기자 명단眔 있습니다!',
    hi: 'यह ईमेल पहले से ही प्रतीक्षा सूची Ⓒइं है!'
  },
  'Errore di connessione. Riprova.': { 
    it: 'Errore di connessione. Riprova.', 
    en: 'Connection error. Please try again.',
    es: 'Error de conexión. Inténtalo de nuevo.',
    fr: 'Erreur de connexion. Veuillez réessayer.',
    de: 'Verbindungsfehler. Bitte versuchen Sie es erneut.',
    ru: 'Ошибка подключения. Пожалуйста, попробуйте снова.',
    ja: '接絚エラー。もうイのどおためしください。',
    zh: '诞接错误。请重试。',
    ko: '연결 오류. 다쇜 시도해 주세요.',
    hi: 'थनेक्शन त्रुटिऌ ⒧ृपया पुनॏ प्रयास ⒕रें"�$�'
  },
  'La tua email': { 
    it: 'La tua email', 
    en: 'Your email',
    es: 'Tu correo',
    fr: 'Votre e-mail',
    de: 'Deine E-Mail',
    ru: 'Ваш email',
    ja: 'あなたのメール',
    zh: '传的邮管',
    ko: '당신의 이륔일',
    hi: 'आपका ईमेल'
  },
  'è stata aggiunta alla lista prioritaria.': { 
    it: 'èstata aggiunta alla lista prioritaria.', 
    en: 'has been added to the priority list.',
    es: 'ha sido añadido a la lista prioritaria.',
    fr: 'a été ajouté à la liste prioritaire.',
    de: 'wurde der Prioritätsliste hinzugefügt.',
    ru: 'добавлен в приоритетный список.',
    ja: '優先リストに追加されませた.�',
    zh: '已加入优先名单。',
    ko: '우선순위 목	Ρ읗 ܆㰀되었습니다.',
    hi: 'प्राथमिकता सूची Ⓒइं जो़॔ गया है.'
  },
  'Ti contatteremo non appena i server saranno aperti al pubblico.': { 
    it: 'Ti contatteremo non appena i server saranno aperti al pubblico.', 
    en: 'We will contact you as soon as the servers are open to the public.',
    es: 'Te contactaremos tan pronto como los servidores estén abiertos al público.',
    fr: 'Nous vous contacterons dès que les serveurs seront ouverts au public.',
    de: 'Wir werden dich kontaktieren, sobald die Server für die Öffentlichkeit zugänglich sind.',
    ru: 'Мы свяжемся с вами, как только серверы станут открыты для всех.',
    ja: 'サーバーが一般公開され次第ご連絡いたします。',
    zh: '服务器向公众开放后，我们将立即与您联系。',
    ko: '서버가 일반眼로 공개되는 대로 셨락드리�9습니다.',
    hi: 'जैसे ही सर्वर जनता के लिऌ खुलेंगे हम इपसे संपर्क करेंगेतए"
  },
  'La piattaforma è attualmente in fase di Closed Beta.': { 
    it: 'La piattaforma è attualmente in fase di Closed Beta.', 
    en: 'The platform is currently in Closed Beta.',
    es: 'La plataforma está actualmente en Beta Cerrada.',
    fr: 'La plateforme est actuellement en Bêta Fermée.',
    de: 'Die Plattform befindet sich derzeit in der Closed Beta.',
    ru: 'Платформа в настоящее время находится в закрытом бета-тестировании.',
    ja: 'プラットフォームに獾在クローズドベーேです。',
    zh: '该平台目前处于封闬内测陶段。',
    ko: '플랫鏼은 프재 클로즈 베냀 중앞니다.',
    hi: 'ब्लेटफॉर्ब वर्तमान में क्लोज्ठ बीटा चरण में है.'
  },
  'Lascia la tua email per entrare in lista d\'attesa.': { 
    it: 'Lascia la tua email per entrare in lista d\'attesa.', 
    en: 'Leave your email to join the waitlist.',
    es: 'Deja tu correo para unirte a la lista de espera.',
    fr: 'Laissez votre e-mail pour rejoindre la liste d''attente.',
    de: 'Hinterlasse deine E-Mail, um der Warteliste beizutreten.',
    ru: 'Оставьте свой email, чтобы присоединиться к списку ожидания.',
    ja: '順番待ちリストに参加するにはメールアドレスを残してください。',
    zh: '留下您的邮箱以加入候补名单。',
    ko: '대기자 명단眔 등록'x�돤묈 이륔일을 남결주세요.',
    hi: 'प्रतीक्षा सूची में शामिल होने के लिऌ अपना ईमेल छोड़ें.'
  },
  'La tua email (es. dj@gmail.com)': { 
    it: 'La tua email (es. dj@gmail.com)', 
    en: 'Your email (e.g. dj@gmail.com)',
    es: 'Tu correo (ej. dj@gmail.com)',
    fr: 'Votre e-mail (ex. dj@gmail.com)',
    de: 'Deine E-Mail (z.B. dj@gmail.com)',
    ru: 'Ваш email (напѠ. dj@gmail.com)',
    ja: 'メールアドレス (例: dj@gmail.com)',
    zh: '传的邮管 (例 dj@gmail.com)',
    ko: '이륔일 (예: dj@gmail.com)',
    hi: 'आपका उमेल (उदऴ. dj@gmail.com)'
  },
  'Iscrizione in corso...': { 
    it: 'Iscrizione in corso...', 
    en: 'Joining...',
    es: 'Uniéndose...',
    fr: 'Inscription en cours...',
    de: 'Tritt bei...',
    ru: 'Присоединяемся...',
    ja: '参加中...',
    zh: '厠兕K..',
    ko: '가쟅 중...',
    hi: 'शामिल ह▋ रहे हफ़ं...'
  },
  'Mettimi in Lista d\'Attesa': { 
    it: 'Mettimi in Lista d''Attesa', 
    en: 'Join Waitlist',
    es: 'Unirse a la lista de espera',
    fr: 'Rejoindre la liste',
    de: 'Warteliste beitreten',
    ru: 'Присоединитьсю',
    ja: '順番ちに登錱ç',
    zh: '加入候补名单���(������耟�2��òz@��NǮ�w����(������耟�����7��Â������W��7��߂�����ゖ��k�� �����������ۂ����������ȃ���Z,�(����(�������ͼ�]��̜��(������耝����ͼ�]��̜��(������耝]��́����̜�(������耝���ͼ�]��̜�(������耝���́]��̜�(������耝]��̵i՝�����(������耟BSB�FFFB��]��̜�(������耝]��ώ
��
��
�
䜰(�����耝]��̃����^���(������耝]��̃��G�:4��(������耝]��̃��?��W��7��ゖ��Ȝ(����(���M=9<�U8�(�������Ѥ�]����Ф���(������耝M=9<�U8�(�������Ѥ�]����Ф���(������耝$�4��(�������Ё]����Ф��(������耝M=d�U8�(������хȁ	����ѕɄ���(������耝)�MU%L�U8�(�������ѕȁ]����Ф��(������耝% �	%8�%8�(��]����Ёٕɉ��������(������耟B��BSBcBSB[BWBd��BB�B�B�B�F;FB�FF0�B�B�F#B�B�B�B褜�(������耟����+��ݜ���
��
����� �ۚ:���h���(�����耟�"G�b��(������{�v��Jǖ2���(������耟���*P�+�z�.#�.������FG��S������(������耟�����#�����?��T��������s�����炖������׊Z'��˂�����C��W�������W��7����C��W��Â�����(����(���M=9<�U8�8�������Ѥ�]����Ф���(������耝M=9<�U8�8�������Ѥ�]����Ф���(������耝$�4��8�������Ё]����Ф��(������耝M=d�U8�8������хȁ	����ѕɄ���(������耝)�MU%L�U8�8�������ѕȁ]����Ф��(������耝% �	%8�%8�8��]����Ёٕɉ��������(������耟B��B�BCBwBCBP��BB�B�B�B�F;FB�FF0�B�B�F#B�B�B�B褜�(������耟�����W�
��ώݜ���
��
����� �ߚ:���h���(�����耟�"G�b����'��t����;�v_�Jǖ2���(������耟���*P��23�z��������v�FG��S������(������耟�����7������?��T������7��Â�ۂ���をT���炖������ׂZ'��˂�����G��W�������W��7����G��W��Â����	K�	�Y\��]�Έ�]�	�Y\��]��[��	�X\��]	�\Έ	�Y\��Y�����	�X\��0�I�N�	�X\��	��N�	�(4b�/t/�.���N�	�n �h-	���	�n �g.���Έ	�"�;'�I�N�	�)+8)/�)'8)/�),	�K�	�\�ܘIΈ�]�	�\�ܘI�[��	�^ܙI�\Έ	�^ܘ\�����	�^ܙ\��N�	�\��[�[���N�	�&4`t`t.�-t-4/�,�,4`�c	��N�	�����(����	�����.���Έ	�`�; �y�N�	�)%�)b�)'8)a�) ��K�	љYY	Έ�]�	љYY	�[��	љYY	�\Έ	�[�X�[�����	ћ^	�N�	љYY	��N�	�&�-t/t`�,	��N�	���x����8��I���	�bj9� I��Έ	�e/:��	�N�	�)*�)`8)(I�K�	�\�\�IΈ�]�	�\�\�I�[��	�\�\���\Έ	�\�\�\�����	�\�\�\��N�	�����\���N�	�$4`4`�.4`t`�b���N�	�ਸ��8�����x��	���	� n��+�k����Έ	�%a;b�;"�;b�	�N�	�)%x),�)/�)%x)/�),	�B�N�[�\��X�H[��XY�P�۝^\H[��XY�N�[��XY�N�][��XY�N�
[�Έ[��XY�JHO���Y�
�^N���[��HO���[��B���ۜ�[��XY�P�۝^HܙX]P�۝^[��XY�P�۝^\O�[��XY�N�	�]	���][��XY�N�

HO��K��
�HO�JN�^ܝ�ۜ�[��XY�T�ݚY\�H
��[�[�N���[�[���XX���XX���HJHO��ۜ��[��XY�K�][��HH\�T�]O[��XY�O�	�]	�N�\�QY��X�


HO��ۜ��]�YH��[�ܘY�K��]][J	ٜK[[���H\�[��XY�NY�
�]�Y
H�][���]�Y
NK�JN��ۜ��][��XY�HH
�]�[�Έ[��XY�JHO��][���]�[��N��[�ܘY�K��]][J	ٜK[[����]�[��NN��ۜ�H
�^N���[��HO��]\���[��][ۜ���^WO���[��XY�WH�^NN��]\��
�[��XY�P�۝^��ݚY\��[YO^��[��XY�K�][��XY�K_O����[�[�B��[��XY�P�۝^��ݚY\���
NN�^ܝ�ۜ�\�S[��XY�HH

HO�\�P�۝^
[��XY�P�۝^
N