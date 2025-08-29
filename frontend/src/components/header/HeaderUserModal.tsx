import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import styles from "@/styles/components/HeaderUserModal.module.scss";
import UserIcon from "@/assets/img/icons/account-icon.svg";
import Link from "next/link";
import { useLogoutMutation } from "@/store/api/authApi";
import { useRouter } from "next/navigation";

const HeaderUserModal: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false); // есть ли элемент в DOM
  const [animationState, setAnimationState] = useState<"open" | "closing" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [logout, { isLoading }] = useLogoutMutation();
  const router = useRouter();

  // Открытие меню
  const openMenu = () => {
    setIsMounted(true);
    requestAnimationFrame(() => setAnimationState("open")); // ждём 1 кадр, чтобы анимация стартанула
  };

  // Закрытие меню
  const closeMenu = () => {
    setAnimationState("closing");
    setTimeout(() => {
      setIsMounted(false);
      setAnimationState(null);
    }, 250); // совпадает с transition в SCSS
  };

  const toggleMenu = () => {
    if (animationState === "open") {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Клик вне модалки
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  // Фокус при открытии
  useEffect(() => {
    if (animationState === "open" && menuRef.current) {
      menuRef.current.focus();
    }
  }, [animationState]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      closeMenu();
      router.push("/login");
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  return (
    <div className={styles.container}>
      <button
        ref={buttonRef}
        className={styles.profileButton}
        onClick={toggleMenu}
        aria-label="Открыть меню пользователя"
        aria-expanded={animationState === "open"}
        aria-controls="user-menu"
        aria-haspopup="menu"
      >
        <UserIcon
          className={styles.userIcon}
          width={48}
          height={48}
          aria-hidden="true"
        />
      </button>

      {isMounted && (
        <div
          ref={menuRef}
          className={classNames(
            styles.menu,
            animationState === "open" && styles.menuOpen,
            animationState === "closing" && styles.menuClosing
          )}
          tabIndex={-1}
          role="menu"
          aria-labelledby="user-menu-label"
        >
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
                role="menuitem"
              >
                {isLoading ? "Выход..." : "Выйти"}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HeaderUserModal;
