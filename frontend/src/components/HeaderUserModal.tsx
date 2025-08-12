import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/components/HeaderUserModal.module.scss';
import UserIcon from '@/assets/img/icons/account-icon.svg';
import Link from 'next/link';
import { useLogoutMutation } from '@/store/api/authApi';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';

const HeaderUserModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [logout, { isLoading }] = useLogoutMutation();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      menuRef.current.focus();
    }
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      setIsOpen(false);
      router.push('/login');
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  return (
    <div className={styles.container}>
      <button
        ref={buttonRef}
        className={styles.profileButton}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Открыть меню пользователя"
        aria-expanded={isOpen}
        aria-controls="user-menu"
        aria-haspopup="menu">
        <UserIcon className={styles.userIcon} width={48} height={48} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className={styles.menu}
          tabIndex={-1}
          role="menu"
          aria-labelledby="user-menu-label">
          <span id="user-menu-label" className={styles.menuTitle}>
            Меню пользователя
          </span>
          <ul className={styles.menuList}>
            <li className={styles.menuItem} role="none">
              <Link href="/profile" className={styles.menuLink} role="menuitem">
                Профиль
              </Link>
            </li>
            <li className={styles.menuItem} role="none">
              <Link href="/settings" className={styles.menuLink} role="menuitem">
                Настройки
              </Link>
            </li>
            <li className={styles.menuItem} role="none">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className={classNames(styles.menuLink, styles.logoutButton)}
                role="menuitem">
                {isLoading ? 'Выход...' : 'Выйти'}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HeaderUserModal;
