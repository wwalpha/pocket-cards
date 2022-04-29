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
    var router: WeeklyChoiceRouter = .init()

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
            if viewModel.mode == MODE.WEEKLY_ABILITY {
                router.makeTest(selected: viewModel.selectedRows())
            }
            if viewModel.mode == MODE.WEEKLY_PRACTICE {
                router.makePractice(groupIds: viewModel.selection)
            }
        }
    }
}

extension WeeklyChoiceView: WeeklyChoiceDisplayLogic {
    func showGroups(model: WeeklyChoiceViewModel) {
        DispatchQueue.main.async {
            viewModel.isLoading = model.isLoading
        }

        viewModel.dataRows = model.dataRows
    }
}

extension WeeklyChoiceView {
    func configureView(subject: String, mode: String) -> some View {
        var view = self
        let interactor = WeeklyChoiceInteractor()
        let presenter = WeeklyChoicePresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        view.viewModel.subject = subject
        view.viewModel.mode = mode
        view.viewModel.isLoading = true

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
