const mongoose = require('mongoose');

const schema = require('../../models');
const { logger } = require('../../utils/winston');

const handleQueryError = (error, queryName) => {
    logger.error(`Error executing ${queryName} query:`, error);
    throw error;
};

const find = async ({ model, query = {}, options = {} }) => {
    try {
        const results = await schema[model].find(query, {}, options);
        return results;
    } catch (error) {
        handleQueryError(error, 'find');
    }
};

const findOne = async ({ model, query = {}, options = {} }) => {
    try {
        const result = await schema[model].findOne(query, {}, options);
        return result;
    } catch (error) {
        handleQueryError(error, 'findOne');
    }
};

const findById = async ({ model, id, options = {} }) => {
    try {
        const result = await schema[model].findById(id, {}, options);
        return result;
    } catch (error) {
        handleQueryError(error, 'findById');
    }
};

const create = async ({ model, data }) => {
    try {
        const result = await schema[model].create(data);
        return result;
    } catch (error) {
        handleQueryError(error, 'create');
    }
};

const update = async ({ model, query, updateData }) => {
    try {
        const result = await schema[model].findOneAndUpdate(query, updateData, { new: true });
        return result;
    } catch (error) {
        handleQueryError(error, 'update');
    }
};

const deleteById = async ({ model, id }) => {
    try {
        const result = await schema[model].findByIdAndDelete(id);
        return result;
    } catch (error) {
        handleQueryError(error, 'deleteById');
    }
};

const deleteMany = async ({ model, query = {} }) => {
    try {
        const result = await schema[model].deleteMany(query);
        return result;
    } catch (error) {
        handleQueryError(error, 'deleteMany');
    }
};

const countDocuments = async ({ model, query = {} }) => {
    try {
        const count = await schema[model].countDocuments(query);
        return count;
    } catch (error) {
        handleQueryError(error, 'countDocuments');
    }
};

module.exports = {
    find,
    findOne,
    findById,
    create,
    update,
    deleteById,
    deleteMany,
    countDocuments,
};