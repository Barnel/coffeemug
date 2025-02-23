import { describe, expect, test } from '@jest/globals';
import { ERROR_TYPES } from '../../src/utils/errorTypes';
import { isProductValid } from '../../src/modules/products/interfaces/product.interface';

describe('Product Data', () => {
    describe('Zod validation works properly', () => {
        test('productData validation happy path', () => {
            const productData = {
                name: 'product',
                description: 'description',
                price: 1,
                stock: 1

            };
            const product = isProductValid(productData);
            expect(product.name).toEqual(productData.name);
        });

        test('productData validation missing required param', () => {
            const characterData = {
                description: "description"
            };

            try {
                isProductValid(characterData);
            } catch (e) {
                expect(e.name).toEqual(ERROR_TYPES.ZOD_ERROR);
                expect(e.issues[0].message).toEqual('Required');
            }
        });

        test('productData validation wrong type', () => {
            const productData = {
                name: 111,
            };

            try {
                isProductValid(productData);
            } catch (e) {
                expect(e.name).toEqual(ERROR_TYPES.ZOD_ERROR);
                expect(e.issues[0].message).toEqual('Expected string, received number');
            }
        });
    });
});
