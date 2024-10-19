"use strict"

class RenderTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sortDirection: 1,
            sortColumn: "name",
            selectedAttraction: null,
            modalOpen: false,
            deleteModalOpen: false,
            newAttractionModalOpen: false,
            editModalOpen: false,
            tagsManagerModalOpen: false
        }
    }

    handleHeaderClick = (column) => {
        let sortDirection = this.state.sortDirection
        if (this.state.sortColumn === column) {
            sortDirection = -sortDirection
        } else {
            sortDirection = 1
        }

        this.props.attractions.sort((a, b) => {
            if (a[column] < b[column]) return -sortDirection
            if (a[column] > b[column]) return sortDirection
            return 0
        })

        this.setState({sortDirection, sortColumn: column})
    }

    openModal = (attraction) => {
        this.setState({
            modalOpen: true,
            selectedAttraction: attraction
        })
    }

    closeModal = () => {
        this.setState({
            modalOpen: false,
            selectedAttraction: null
        })
    }

    openNewAttractionModal = () => {
        this.setState({
            newAttractionModalOpen: true
        })
    }

    closeNewAttractionModal = () => {
        this.setState({
            newAttractionModalOpen: false
        })
    }

    openDeleteModal = (attraction) => {
        this.setState({
            deleteModalOpen: true,
            selectedAttraction: attraction
        })
    }

    closeDeleteModal = () => {
        this.setState({
            deleteModalOpen: false,
            selectedAttraction: null
        })
    }

    openEditModal = (attraction) => {
        this.setState({
            editModalOpen: true,
            selectedAttraction: attraction
        })
    }

    closeEditModal = () => {
        this.setState({
            editModalOpen: false,
            selectedAttraction: null
        })
    }

    openTagsManagerModal = () => {
        this.setState({
            tagsManagerModalOpen: true
        })
    }

    closeTagsManagerModal = () => {
        this.setState({
            tagsManagerModalOpen: false
        })
    }

    onDelete = (attraction) => {
        this.props.onDeleteAttraction(attraction)
        this.setState({
            deleteModalOpen: false,
            modalOpen: false,
            selectedAttraction: null
        })
    }

    render() {
        const {
            sortColumn,
            sortDirection,
            selectedAttraction,
            deleteModalOpen,
            newAttractionModalOpen,
            modalOpen,
            editModalOpen,
            tagsManagerModalOpen
        } = this.state

        const {
            attractions,
            tagsList,
            newAttraction,
            newImageURL,
            handleNewInputChange,
            handleNewFreeChange,
            handleNewTagChange,
            handleImageURLChange,
            handleAddImage,
            handleAddAttraction,
            handleEditAttraction,
            handleAddTag,
            handleDeleteTag,
            handleEditTag
        } = this.props

        let tableHeaderTitles = ["ID", "Name", "Latitude", "Longitude", "Address", "Description", "Phone Number", "Rating", "Free", "Tags"]
        let tableHeadersData = ["id", "name", "latitude", "longitude", "address", "description", "phoneNumber", "rating", "free", "tags"]

        return (
            <div>
                <div className="buttons">
                    <button onClick={this.openNewAttractionModal}>Add Attraction</button>
                    <button onClick={this.openTagsManagerModal}>Manage Tags</button>
                </div>
                <table>
                    <thead>
                    <tr>
                        {tableHeaderTitles.map((title, index) => {
                            let header = tableHeadersData[index]
                            return (
                                <th key={header} onClick={() => this.handleHeaderClick(header)}>
                                    {title}
                                    {sortColumn === header && (sortDirection === 1 ? "▲" : "▼")}
                                </th>
                            )
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {attractions.map((attraction, index) => (
                        <tr key={index} onClick={() => this.openModal(attraction)}>
                            <td>{attraction.id}</td>
                            <td>{attraction.name}</td>
                            <td>{attraction.latitude}</td>
                            <td>{attraction.longitude}</td>
                            <td>{attraction.address}</td>
                            <td>{attraction.description}</td>
                            <td>{attraction.phoneNumber}</td>
                            <td>{attraction.rating}</td>
                            <td>{attraction.free}</td>
                            <td>
                                {attraction.tags.map((tag, index) => (
                                    <li key={index}>{tag}</li>
                                ))}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {(modalOpen || newAttractionModalOpen || editModalOpen || tagsManagerModalOpen) && (
                    <Modal
                        attraction={selectedAttraction}
                        onClose={this.closeModal}
                        showDeleteModal={this.openDeleteModal}
                        deleteModalOpen={deleteModalOpen}
                        onDelete={this.onDelete}
                        onDeleteClose={this.closeDeleteModal}
                        newAttractionModalOpen={newAttractionModalOpen}
                        onNewAttractionClose={this.closeNewAttractionModal}
                        editModalOpen={editModalOpen}
                        onEditClose={this.closeEditModal}
                        showEditModal={this.openEditModal}
                        tagsManagerModalOpen={tagsManagerModalOpen}
                        onTagsManagerClose={this.closeTagsManagerModal}
                        handleNewInputChange={handleNewInputChange}
                        handleNewFreeChange={handleNewFreeChange}
                        handleNewTagChange={handleNewTagChange}
                        handleImageURLChange={handleImageURLChange}
                        handleAddImage={handleAddImage}
                        handleAddAttraction={handleAddAttraction}
                        handleEditAttraction={handleEditAttraction}
                        tagsList={tagsList}
                        newAttraction={newAttraction}
                        newImageURL={newImageURL}
                        handleAddTag={handleAddTag}
                        handleDeleteTag={handleDeleteTag}
                        handleEditTag={handleEditTag}
                    />
                )}
            </div>
        )
    }
}

class AttractionsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            attractions: [],
            attractionsFiltered: [],
            ratingFilter: 6,
            freeFilter: "All",
            tagsList: [],
            selectedTagsList: [],
            searchFilter: "",
            newAttraction: {
                name: '',
                latitude: '',
                longitude: '',
                address: '',
                description: '',
                phoneNumber: '',
                rating: 5,
                free: 'No',
                tags: [],
                photosURLs: []
            },
            newImageURL: ''
        }
    }

    componentDidMount() {
        fetch("./json/attractions.json")
            .then(response => response.json())
            .then(attractions => {
                attractions.forEach(attraction => {
                    if (attraction.description.toLowerCase().includes("free")) {
                        attraction.free = "Yes"
                    } else {
                        attraction.free = "No"
                    }
                })

                let tags = new Set()
                attractions.forEach(attraction => {
                    attraction.tags.forEach(tag => tags.add(tag))
                })

                let tagsList = Array.from(tags)

                this.setState({
                    attractions: attractions,
                    attractionsFiltered: attractions,
                    tagsList: tagsList
                })
            })
    }

    handleSearchChange = (e) => {
        let search = e.target.value
        this.setState({searchFilter: search})
        this.attractionsFiltered(search, this.state.ratingFilter, this.state.freeFilter, this.state.selectedTagsList)
    }

    handleRatingChange = (e) => {
        let rating = parseFloat(e.target.value)
        this.setState({ratingFilter: rating})
        this.attractionsFiltered(this.state.searchFilter, rating, this.state.freeFilter, this.state.selectedTagsList)
    }

    handleFreeChange = (e) => {
        let free = e.target.value
        this.setState({freeFilter: free})
        this.attractionsFiltered(this.state.searchFilter, this.state.ratingFilter, free, this.state.selectedTagsList)
    }

    handleTagsChange = (e) => {
        let tag = e.target.value
        let selectedTagsList = this.state.selectedTagsList

        let updatedTagsList = e.target.checked
            ? [...selectedTagsList, tag]
            : selectedTagsList.filter(selectedTags => selectedTags !== tag)

        this.setState({selectedTagsList: updatedTagsList})
        this.attractionsFiltered(this.state.searchFilter, this.state.ratingFilter, this.state.freeFilter, updatedTagsList)
    }

    handleAddTag = () => {
        let newTag = prompt("New Tag:")
        if (newTag) {
            let updatedTagsList = [...this.state.tagsList, newTag]
            this.setState({tagsList: updatedTagsList})
        }
    }

    handleDeleteTag = (tag) => {
        let updatedTagsList = this.state.tagsList.filter(t => t !== tag)
        let updatedAttractions = this.state.attractions.map(attraction => ({
            ...attraction,
            tags: attraction.tags.filter(t => t !== tag)
        }))
        let updatedSelectedTagsList = this.state.selectedTagsList.filter(t => t !== tag)

        this.setState({
            tagsList: updatedTagsList,
            attractions: updatedAttractions,
            attractionsFiltered: updatedAttractions,
            selectedTagsList: updatedSelectedTagsList
        })
    }

    handleEditTag = (tag) => {
        let newTagValue = prompt("Edit Tag:", tag)
        if (newTagValue && newTagValue !== tag) {
            let updatedTagsList = this.state.tagsList.map(t => t === tag ? newTagValue : t)
            let updatedAttractions = this.state.attractions.map(attraction => ({
                ...attraction,
                tags: attraction.tags.map(t => t === tag ? newTagValue : t)
            }))
            let updatedSelectedTagsList = this.state.selectedTagsList.map(t => t === tag ? newTagValue : t)

            this.setState({
                tagsList: updatedTagsList,
                attractions: updatedAttractions,
                attractionsFiltered: updatedAttractions,
                selectedTagsList: updatedSelectedTagsList
            })
        }
    }

    onDeleteAttraction = (attraction) => {
        let updatedAttractions = this.state.attractions.filter(a => a.id !== attraction.id)
        this.setState({
            attractions: updatedAttractions,
            attractionsFiltered: updatedAttractions
        })
    }

    handleEditAttraction = (editedAttraction) => {
        const updatedAttractions = this.state.attractions.map(attraction =>
            attraction.id === editedAttraction.id ? editedAttraction : attraction
        )

        this.setState({
            attractions: updatedAttractions,
            attractionsFiltered: updatedAttractions
        })
    }

    handleNewInputChange = (e) => {
        const {name, value} = e.target
        const updatedAttraction = {
            ...this.state.newAttraction,
            [name]: value
        }
        this.setState({
            newAttraction: updatedAttraction
        })
    }

    handleNewFreeChange = (e) => {
        const updatedAttraction = {
            ...this.state.newAttraction,
            free: e.target.value
        }
        this.setState({
            newAttraction: updatedAttraction
        })
    }

    handleNewTagChange = (e) => {
        const {value, checked} = e.target
        const currentTags = this.state.newAttraction.tags
        const updatedTags = checked
            ? [...currentTags, value]
            : currentTags.filter(tag => tag !== value)

        this.setState({
            newAttraction: {
                ...this.state.newAttraction,
                tags: updatedTags
            }
        })
    }

    handleImageURLChange = (e) => {
        this.setState({newImageURL: e.target.value})
    }

    handleAddImage = () => {
        const {newImageURL, newAttraction} = this.state
        if (newImageURL) {
            this.setState({
                newAttraction: {
                    ...newAttraction,
                    photosURLs: [...newAttraction.photosURLs, newImageURL]
                },
                newImageURL: ''
            })
        }
    }

    handleAddAttraction = () => {
        const {attractions, newAttraction} = this.state
        const newId = attractions.length + 17
        const newAttractionWithId = {
            ...newAttraction,
            id: newId,
            free: newAttraction.free === "Yes" ? "Yes" : "No"
        }

        this.setState({
            attractions: [...attractions, newAttractionWithId],
            attractionsFiltered: [...attractions, newAttractionWithId],
            newAttraction: {
                name: '',
                latitude: '',
                longitude: '',
                address: '',
                description: '',
                phoneNumber: '',
                rating: 5,
                free: 'No',
                tags: [],
                photosURLs: []
            },
            newImageURL: ''
        })
    }

    attractionsFiltered = (search, rating, free, selectedTags) => {
        let filtered = this.state.attractions

        if (rating) {
            filtered = filtered.filter(attraction => attraction.rating <= rating)
        }

        if (free !== "All") {
            filtered = filtered.filter(attraction => attraction.free === free)
        }

        if (selectedTags.length) {
            filtered = filtered.filter(attraction =>
                selectedTags.some(tag => attraction.tags.includes(tag))
            )
        }

        if (search) {
            filtered = filtered.filter(attraction =>
                attraction.name.toLowerCase().includes(search.toLowerCase())
            )
        }

        this.setState({attractionsFiltered: filtered})
    }

    render() {
        const {
            attractionsFiltered,
            ratingFilter,
            freeFilter,
            tagsList,
            selectedTagsList,
            searchFilter,
            newAttraction,
            newImageURL
        } = this.state

        return (
            <div>
                <div className="filterBox">
                        <div className="filterContent">
                            <label>
                                <input type="text" value={searchFilter} onChange={this.handleSearchChange}
                                       placeholder="Search..."/>
                            </label>
                        </div>

                        <div className="filterContent">
                            <label>
                                <select value={ratingFilter} onChange={this.handleRatingChange}>
                                    <option value={6} hidden>Rating Filter</option>
                                    <option value={5}>5 Stars</option>
                                    <option value={4}>4 Stars</option>
                                    <option value={3}>3 Stars</option>
                                    <option value={2}>2 Stars</option>
                                    <option value={1}>1 Star</option>
                                </select>
                            </label>
                        </div>

                        <div className="filterContent">
                            <label>
                                <select value={freeFilter} onChange={this.handleFreeChange}>
                                    <option value="All">Free and Paid</option>
                                    <option value="Yes">Free Only</option>
                                    <option value="No">Paid Only</option>
                                </select>
                            </label>
                        </div>

                        {tagsList.map((tag) => (
                            <label key={tag} className="filterTagsList">
                                <input
                                    type="checkbox"
                                    value={tag}
                                    checked={selectedTagsList.includes(tag)}
                                    onChange={this.handleTagsChange}
                                />
                                {tag}
                            </label>
                        ))}
                </div>

                <RenderTable
                    attractions={attractionsFiltered}
                    onDeleteAttraction={this.onDeleteAttraction}
                    handleEditAttraction={this.handleEditAttraction}
                    tagsList={tagsList}
                    newAttraction={newAttraction}
                    newImageURL={newImageURL}
                    handleNewInputChange={this.handleNewInputChange}
                    handleNewFreeChange={this.handleNewFreeChange}
                    handleNewTagChange={this.handleNewTagChange}
                    handleImageURLChange={this.handleImageURLChange}
                    handleAddImage={this.handleAddImage}
                    handleAddAttraction={this.handleAddAttraction}
                    handleAddTag={this.handleAddTag}
                    handleDeleteTag={this.handleDeleteTag}
                    handleEditTag={this.handleEditTag}
                />
            </div>
        )
    }
}

class Modal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editedAttraction: null
        }
    }

    handleEditChange = (e) => {
        const {name, value} = e.target
        this.setState({
            editedAttraction: {...this.state.editedAttraction, [name]: value}
        })
    }

    handleEditFreeChange = (e) => {
        this.setState({
            editedAttraction: {...this.state.editedAttraction, free: e.target.value}
        })
    }

    handleEditTagChange = (e) => {
        const {value, checked} = e.target
        const currentTags = this.state.editedAttraction.tags
        const updatedTags = checked
            ? [...currentTags, value]
            : currentTags.filter(tag => tag !== value)

        this.setState({
            editedAttraction: {...this.state.editedAttraction, tags: updatedTags}
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.editModalOpen && !prevProps.editModalOpen) {
            this.setState({
                editedAttraction: {...this.props.attraction}
            })
        }
    }

    submitEdit = () => {
        this.props.handleEditAttraction(this.state.editedAttraction)
        this.props.onEditClose()
    }

    render() {
        const {
            attraction,
            onClose,
            showDeleteModal,
            deleteModalOpen,
            onDelete,
            onDeleteClose,
            newAttractionModalOpen,
            handleNewInputChange,
            handleNewFreeChange,
            handleNewTagChange,
            handleImageURLChange,
            handleAddImage,
            handleAddAttraction,
            tagsList,
            newAttraction,
            newImageURL,
            onNewAttractionClose,
            editModalOpen,
            onEditClose,
            tagsManagerModalOpen,
            onTagsManagerClose,
            handleAddTag,
            handleDeleteTag,
            handleEditTag
        } = this.props

        const { editedAttraction } = this.state

        if (tagsManagerModalOpen) {
            return (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <button onClick={onTagsManagerClose}>X</button>
                        <h2>Tags Manager</h2>
                        <button onClick={handleAddTag}>Add Tag</button>
                        <div>
                            {tagsList.map((tag) => (
                                <div key={tag}>
                                    <button onClick={() => handleDeleteTag(tag)}>X</button>
                                    <button onClick={() => handleEditTag(tag)}>Edit</button>
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }

        if (editModalOpen && editedAttraction) {
            return (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <button onClick={onEditClose}>X</button>
                        <form>
                            <div>
                                <label>
                                    Name:
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedAttraction.name}
                                        onChange={this.handleEditChange}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Latitude:
                                    <input
                                        type="text"
                                        name="latitude"
                                        value={editedAttraction.latitude}
                                        onChange={this.handleEditChange}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Longitude:
                                    <input
                                        type="text"
                                        name="longitude"
                                        value={editedAttraction.longitude}
                                        onChange={this.handleEditChange}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Address:
                                    <input
                                        type="text"
                                        name="address"
                                        value={editedAttraction.address}
                                        onChange={this.handleEditChange}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Description:
                                    <input
                                        type="text"
                                        name="description"
                                        value={editedAttraction.description}
                                        onChange={this.handleEditChange}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Phone Number:
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={editedAttraction.phoneNumber}
                                        onChange={this.handleEditChange}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Rating:
                                    <input
                                        type="text"
                                        name="rating"
                                        value={editedAttraction.rating}
                                        onChange={this.handleEditChange}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Free:
                                    <select
                                        value={editedAttraction.free}
                                        onChange={this.handleEditFreeChange}
                                    >
                                        <option value="No">No</option>
                                        <option value="Yes">Yes</option>
                                    </select>
                                </label>
                            </div>

                            <div>
                                <label>
                                    Tags:
                                    {tagsList.map((tag) => (
                                        <label key={tag}>
                                            <input
                                                type="checkbox"
                                                value={tag}
                                                checked={editedAttraction.tags.includes(tag)}
                                                onChange={this.handleEditTagChange}
                                            />
                                            {tag}
                                        </label>
                                    ))}
                                </label>
                            </div>

                            <button type="button" onClick={this.submitEdit}>
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )
        }

        if (deleteModalOpen && attraction) {
            return (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <button onClick={onDeleteClose}>X</button>
                        <div className="delete-modalContent">
                            <h3>Are you sure you want to delete this attraction?</h3>
                            <p>{attraction.name}</p>
                            <button onClick={() => onDelete(attraction)}>Yes, Delete</button>
                            <button onClick={onDeleteClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            )
        }

        if (newAttractionModalOpen) {
            return (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <form>
                            <button onClick={onNewAttractionClose}>X</button>
                            <br/>
                            <div>
                                <label>
                                    Name:
                                    <input
                                        type="text"
                                        name="name"
                                        value={newAttraction.name}
                                        onChange={handleNewInputChange}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Latitude:
                                    <input
                                        type="text"
                                        name="latitude"
                                        value={newAttraction.latitude}
                                        onChange={handleNewInputChange}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Longitude:
                                    <input
                                        type="text"
                                        name="longitude"
                                        value={newAttraction.longitude}
                                        onChange={handleNewInputChange}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Address:
                                    <input
                                        type="text"
                                        name="address"
                                        value={newAttraction.address}
                                        onChange={handleNewInputChange}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Description:
                                    <input
                                        type="text"
                                        name="description"
                                        value={newAttraction.description}
                                        onChange={handleNewInputChange}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Phone Number:
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={newAttraction.phoneNumber}
                                        onChange={handleNewInputChange}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Rating:
                                    <input
                                        type="text"
                                        name="rating"
                                        value={newAttraction.rating}
                                        onChange={handleNewInputChange}
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Free:
                                    <select
                                        value={newAttraction.free}
                                        onChange={handleNewFreeChange}
                                    >
                                        <option value="No">No</option>
                                        <option value="Yes">Yes</option>
                                    </select>
                                </label>
                            </div>

                            <div>
                                <label>
                                    Tags:
                                    {tagsList.map((tag) => (
                                        <label key={tag}>
                                            <input
                                                type="checkbox"
                                                value={tag}
                                                checked={newAttraction.tags.includes(tag)}
                                                onChange={handleNewTagChange}
                                            />
                                            {tag}
                                        </label>
                                    ))}
                                </label>
                            </div>

                            <div>
                                <label>
                                    Image URL:
                                    <input
                                        type="text"
                                        value={newImageURL}
                                        onChange={handleImageURLChange}
                                        placeholder="Enter image URL"
                                    />
                                </label>

                                <br/>
                                <button type="button" onClick={handleAddImage}>Add Image</button>
                                <br/>
                                {newAttraction.photosURLs.map((imgUrl, index) => (
                                    <img key={index} src={imgUrl} alt={imgUrl}/>
                                ))}
                            </div>
                            <br/>
                            <div>
                                <button type="button" onClick={handleAddAttraction}>Add Attraction</button>
                            </div>
                        </form>
                    </div>
                </div>
            )
        }

        if (attraction) {
            return (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <button onClick={onClose}>X</button>
                        <button onClick={() => showDeleteModal(attraction)}>Delete Attraction</button>
                        <button onClick={() => this.props.showEditModal(attraction)}>Edit Attraction</button>
                        <div>
                            <h2>{attraction.name}</h2>
                            <p>ID: {attraction.id}</p>
                            <p>Latitude: {attraction.latitude}</p>
                            <p>Longitude: {attraction.longitude}</p>
                            <p>Address: {attraction.address}</p>
                            <p>Description: {attraction.description}</p>
                            <p>Phone: {attraction.phoneNumber}</p>
                            <p>Rating: {attraction.rating}</p>
                            <p>Free: {attraction.free}</p>
                            <p>Tags:
                                {attraction.tags.map((tag, index) => (
                                    <li key={index}>{tag}</li>
                                ))}
                            </p>

                            <h3>Photos</h3>
                            {attraction.photosURLs && attraction.photosURLs.map((url, index) => (
                                <img key={index} src={url} alt={url}/>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }

        return null
    }
}

ReactDOM.render(<AttractionsList/>, document.getElementById('attractionsTable'))