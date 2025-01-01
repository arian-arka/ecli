object({
    admins:
        array({
            0:
                number({
                    required_error: translate(messages.validation.required, '0',) as string,
                    invalid_type_error: translate(messages.validation.number, '0',) as string
                })
                    .refine((v) => !`${v}`.includes('.'), {message: translate(messages.validation.integer, '0',) as string}).innerType().lte(1, {message: translate(messages.validation.lte_number, '0',) as string)
            ,/* @unknown-rule -> [ exists ] */
        }, {
            required_error: translate(messages.validation.required, 'admins',) as string,
            invalid_type_error: translate(messages.validation.array, 'admins',) as string
        }).refine((v) => v.length <= 0, {message: translate(messages.validation.lte_array, 'admins',) as string}).innerType()
            .refine((v) => v.length >= 100, {message: translate(messages.validation.gte_array, 'admins',) as string}).innerType()
    ,
    suspend:
        boolean({
            required_error: translate(messages.validation.required, 'suspend',) as string,
            invalid_type_error: translate(messages.validation.boolean, 'suspend',) as string
        }),
}, {
    required_error: translate(messages.validation.required, '',) as string,
    invalid_type_error: translate(messages.validation.object, '',) as string
}).optional().nullable()