import { jStoreAsync } from './index';

const initialState = {
	cities: ['Imozumop', 'Hiducuv', 'Gowoju', 'Retona', 'Pirovo', 'Uwlaji', 'Emefetil'],
	emails: ['kogrefenu@leezu.bn', 'et@ravral.ly', 'rul@tecot.us', 'goga@biuka.bo', 'ugwedtuj@idoubcef.nc']
};

const store = new jStoreAsync(initialState, 1200);

store.get('/cities').then(res => console.log(res));
/*
    [
      'Imozumop',
      'Hiducuv',
      'Gowoju',
      'Retona',
      'Pirovo',
      'Uwlaji',
      'Emefetil',
    ]
  */

store.post('/cities', 'foo').catch(e => console.log(e));
