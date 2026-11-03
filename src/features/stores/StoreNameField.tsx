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

/** "Store name" input with suggestions of known stores (logo + name) while typing. */
export function StoreNameField({ value, storeId, error, onChange, onPickStore }: StoreNameFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const pickedStore = getStoreById(storeId)
  // No suggestions once a store was picked and its name was not changed since.
  const isPickedNameUnchanged = pickedStore !== undefined && pickedStore.name === value
  const suggestions = isFocused && !isPickedNameUnchanged ? searchStores(value) : []

  function pick(store: Store) {
    onPickStore(store)
    setIsFocused(false)
  }

  return (
    <div className={styles.wrapper}>
      <TextField
        label={texts.cardForm.name}
        value={value}
        onChange={onChange}
        placeholder={texts.cardForm.namePlaceholder}
        error={error}
        required
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
