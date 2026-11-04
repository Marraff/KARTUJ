import { useState } from 'react'
import { TextField } from '../../components/TextField'
import { texts } from '../../texts/sk'
import { getStoreById, searchStores, type Store } from './storeCatalog'
import { StoreLogo } from './StoreLogo'
import styles from './StoreNameField.module.css'

type StoreNameFieldProps = {
  value: string
  /** Store picked from the suggestions (undefined after the user types). */
  storeId?: string
  error?: string
  onChange: (name: string) => void
  onPickStore: (store: Store) => void
}

// iOS writes its autocorrect word back into the field only after the keyboard closes.
const KEYBOARD_SETTLE_MS = 150

/** "Store name" input with suggestions of known stores (logo + name) while typing. */
export function StoreNameField({ value, storeId, error, onChange, onPickStore }: StoreNameFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  // Changing the key replaces the <input> with a fresh one (see pick).
  const [inputKey, setInputKey] = useState(0)
  const pickedStore = getStoreById(storeId)
  // No suggestions once a store was picked and its name was not changed since.
  const isPickedNameUnchanged = pickedStore !== undefined && pickedStore.name === value
  const suggestions = isFocused && !isPickedNameUnchanged ? searchStores(value) : []

  function pick(store: Store) {
    // Phone keyboards keep the typed word "composing" (autocorrect). After a pick they
    // write that word back into the field and overwrite the picked name ("Lid" instead
    // of "Lidl Plus") – on iOS even some time after the keyboard closed. So: end typing
    // (closes the keyboard), wait until the keyboard is done, then set the name in a
    // brand-new <input>; whatever the keyboard writes later lands in the old, removed one.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    setIsFocused(false)
    setTimeout(() => {
      setInputKey((key) => key + 1)
      onPickStore(store)
    }, KEYBOARD_SETTLE_MS)
  }

  return (
    <div className={styles.wrapper}>
      <TextField
        key={inputKey}
        label={texts.cardForm.name}
        value={value}
        onChange={onChange}
        placeholder={texts.cardForm.namePlaceholder}
        error={error}
        required
        // Store names are brands (dm, OMV, CCC) – autocorrect only gets in the way.
        autoCorrect={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {suggestions.length > 0 && (
        <ul className={styles.suggestions} aria-label={texts.cardForm.storeSuggestions}>
          {suggestions.map((store) => (
            <li key={store.id}>
              <button
                type="button"
                className={styles.suggestion}
                // Keep the input focused, otherwise its blur would hide the list before the tap lands.
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => pick(store)}
              >
                <StoreLogo store={store} name={store.name} color={store.color} size="sm" />
                {store.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
