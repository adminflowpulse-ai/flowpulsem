'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../components/LanguageProvider';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) return;

    setIsLoading(true);

    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
      } else {
        if (data.error === 'Email already exists') {
          setErrorMsg(t('Questa email è già in lista d'attesa!'));
        } else {
          setErrorMsg(t('Errore di connessione. Riprova.'));
        }
      }
    } catch (err) {
      setErrorMsg(t('Errore di connessione. Riprova.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px', zIndex: 10 }>
        <h1 style={{ fontFamily: \"'Dancing Script', cursive\", margin: 0, fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 700, letterSpacing: '3px', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <span style={{ background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))', WebkitBackgroundClip: 'text', color: 'transparent', paddingRight: '5px' }>FlowPulse</span>
            <span style={{ color: 'var(--accent-red)', textShadow: '0 0 20px rgba(255,0,60,0.7)' }}>M</span>
            <sup style={{ color: 'var(--accent-red)', fontSize: 'clamp(1rem, 4vw, 2rem)', marginLeft: '4px', textShadow: 'none' }}></sup>
        </h1>
        <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginTop: '10px', letterSpacing: '2px', textTransform: 'uppercase' }>
          {t('La Nuova Era dell\'Industria Musicale')}
        </p>
      </div>

      <div style={{ background: 'var(--surface-color)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxWidth: '500px', width: '100%', textAlign: 'center', zIndex: 10, backdropFilter: 'blur(10px)' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--accent-blue)', marginBottom: '10px' }}>{t('Accesso Anticipato Chiuso')}</h2>
        
        {isSuccess ? (
          <div style={{ padding: '30px 0' }>
            <h3 style={{ color: 'var(--accent-green)', fontSize: '1.5rem', marginBottom: '15px' }>{t('Benvenuto a Bordo!')}</h3>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.6' }>
              {t('La tua email')} <strong style={{ color: '#fff' }}>{email}</strong> {t('è stata aggiunta alla lista prioritaria.')}
            </p>
            <p style={{ color: 'var(--]^[XZ[�I�[�RZY��	�K���X\��[���	�M\	�O���
	�H�۝]\�[[��ۈ\[�HH�\��\��\�[���\\�H[X��X�ˉ�_B�����]���
H�
����[O^����܎�	ݘ\�K]^[XZ[�I�[�RZY��	�K�I�X\��[����N�	̜�[I�O���
	�HX]Y�ܛXH0�]X[Y[�H[��\�HH���Y�]K��_O��ς��
	�\��XHHXH[XZ[\�[��\�H[�\�H	��]\�K��_B������ܛH۔�X�Z]^�[�T�X�Z]H�[O^��\�^N�	ٛ^	��^\�X�[ێ�	���[[���\�	�M\	�X\��[����N�	̜�[I�_O��[�]�\OH�[XZ[���[YO^�[XZ[B�ې�[��O^�JHO��][XZ[
K�\��]��[YJ_B�X�Z�\�^�
	�HXH[XZ[
\ˈ��XZ[���JI�_H��\]Z\�Y��[O^��Y[�Έ	̌	��ܙ\��Y]\Έ	�L�	��ܙ\��	�\��Y�ؘJ�MK�MK�MK�JI��X��ܛ�[���܎�	ܙؘJ��I���܎�	�ٙ����۝�^�N�	�\�[I��][�N�	ۛۙI�_B�ς��]ۈ\OH��X�Z]�\�X�Y^�\��Y[��H�[O^��Y[�Έ	̌	��ܙ\��Y]\Έ	�L�	��ܙ\��	ۛۙI��X��ܛ�[��	ݘ\�KXX��[�YܘYY[�
I���܎�	�ٙ����۝�^�N�	�K��[I��۝�ZY��	؛�	��\��܎�\��Y[���	ۛ�X[��Y	��	��[�\���[��][ێ�	��X�]H�����\�Y�������X�]N�\��Y[������K���Y�Έ	�M\�ؘJ��M��MK�
I�_O���\��Y[���
	�\�ܚ^�[ۙH[��ܜ�ˋ���H�
	�Y][ZH[�\�H	�]\�I�_B�؝]ۏ���\��ܓ\��	���[O^����܎�	ݘ\�KXX��[�\�Y
I��۝�^�N�	��\�[I�X\��[��_O��\��ܓ\��O��B�ٛܛO��ς�
_B��]��[O^���ܙ\���	�\��Y�ؘJ�MK�MK�MK�JI�Y[����	��	�_O���[O^����܎�	ݘ\�K]^[]]Y
I��۝�^�N�	��\�[I�X\��[����N�	�M\	�^�[�ٛܛN�	�\\��\�I�]\��X�[�Έ	�\	�_O��
	�X��\����X���_O���]��[O^��\�^N�	ٛ^	��^\�X�[ێ�	���[[���\�	�L	�_O���]ۈې�X��^�
HO���]\��\�
	��\���\����_H�[O^��Y[�Έ	�M\	��ܙ\��Y]\Έ	�L�	��X��ܛ�[���܎�	��[��\�[�	��ܙ\��	�\��Y�\�KXX��[�X�YJI���܎�	�ٙ����\��܎�	��[�\���۝�ZY��	؛�	��[��][ێ�	�[����_O��<'�)�
	��ӓ�S��
�ۛ�]H�[]
I�_B�؝]ۏ���]ۈې�X��^�
HO���]\��\�
	��\���\�٘[��_H�[O^��Y[�Έ	�M\	��ܙ\��Y]\Έ	�L�	��X��ܛ�[���܎�	��[��\�[�	��ܙ\��	�\��Y�\�KXX��[�YܙY[�I���܎�	�ٙ����\��܎�	��[�\���۝�ZY��	؛�	��[��][ێ�	�[����_O��<'�m��
	��ӓ�S��S�
�ۛ�]H�[]
I�_B�؝]ۏ���]����]����]����]���
NB