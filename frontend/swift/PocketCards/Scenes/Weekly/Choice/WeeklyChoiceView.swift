//
//  WeeklyChoiceView.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import SwiftUI

struct WeeklyChoiceView: View {
    var interactor: WeeklyChoiceBusinessLogic?
    @Environment(\.editMode) var editMode
    @ObservedObject var viewModel = WeeklyChoiceViewModel()

    var body: some View {
        if viewModel.selection.isEmpty || editMode?.wrappedValue.isEditing == true {
            VStack {
                List(viewModel.dataRows, id: \.self.groupId, selection: $viewModel.selection) { dataRow in
                    Text(dataRow.groupName ?? "")
                }
                .toolbar {
                    EditButton()
                }
            }.padding()
        } else {
            WeeklyTestView().configureView(groupIds: Array(viewModel.selection))
        }
    }
}

extension WeeklyChoiceView: WeeklyChoiceDisplayLogic {
    func showGroups(model: WeeklyChoiceViewModel) {
        viewModel.dataRows = model.dataRows
    }
}

extension WeeklyChoiceView {
    func configureView(subject: String) -> some View {
        var view = self
        let interactor = WeeklyChoiceInteractor()
        let presenter = WeeklyChoicePresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        view.viewModel.subject = subject

        interactor.loadGroups(subject: subject)

        return view
    }
}

struct WeeklyChoiceView_Previews: PreviewProvider {
    static var previews: some View {
        WeeklyChoiceView()
            .previewInterfaceOrientation(.landscapeLeft)
    }
}
